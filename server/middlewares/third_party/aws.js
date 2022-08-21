const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const aws_config = require("../../config/aws")[env];
const logger = require('../../utils/winston_logger');
//const {ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, MAIN_BUCKET, IMG_BUCKET, DIRNAME} = require("../../config/aws");
const { book } = require("../../models");
const { getDateTime } = require("../../helper/date");

const s3 = new AWS.S3({
    accessKeyId: aws_config.ACCESS_KEY_ID,
    secretAccessKey: aws_config.SECRET_ACCESS_KEY,
    region: aws_config.REGION,
});

const storage = multerS3({
    s3: s3,
    
    bucket: function(req,file, cb){
        let fieldName = file.fieldname;
        if(fieldName === "img"){
            cb(null, aws_config.IMG_BUCKET);
        }
        else {
            cb(null, aws_config.MAIN_BUCKET+ "/" + file.fieldname);
        }
    },

    contentType: function(req, file, cb){
        let fieldName = file.fieldname;
        if(fieldName === "img"){
            cb(null,file.mimetype);
        }
        else cb(null, "application/octet-stream");
    },

    key: function (req, file, cb) {
        let fieldName = file.fieldname;
        const fileNameSplit = file.originalname.split('.');
        let fileName = ""
        if(fieldName === "img"){
            if(!file.originalname.includes('thumbnail')) {
                fileName = req.user.email + "_" + getDateTime(Date.now()) + "." + fileNameSplit[fileNameSplit.length - 1];
            }
            else {
                fileName = fileNameSplit[0] + "_" + getDateTime(Date.now()) + "." + fileNameSplit[fileNameSplit.length - 1];
            }
            
        }
        else {
            fileName = fileNameSplit[0] + "_" + getDateTime(Date.now()) + "." + fileNameSplit[fileNameSplit.length - 1];
        }
        
        cb(null, fileName);

    }, // 파일 이름
    acl: 'public-read',
});

const upload = multer({
    storage: storage
}).fields([
    {name: 'file', maxCount: 3},
    {name: 'img', maxCount: 1},
    {name: 'preview', maxCount: 1},
]);

const uploadFile = (req,res, next) => {
    upload(req,res,(error) => {
        if (error instanceof multer.MulterError){
            logger.warn(error.stack);
            return res.status(400).json({ 
                message: 'Upload unsuccessful', 
                errorMessage: error.message,
                errorCode: error.code
            })
        }
        
        if (error){
            logger.error(error.stack);
            return res.status(500).json({
                message: 'Error occured',
                errorMessage: error.message
            });
        } 
            
        console.log('Upload successful.')
        next()
    })
}

const deleteFile = async (req, res, next) =>{
    let id = req.params.bookId;

    try{
        const findedBook = await book.findOne({
            where : {
                id: id,
            }
        });
        const fileUrl = findedBook.file.split('/');
        const imgUrl = findedBook.img.split('/');
        const fileUrlLength = fileUrl.length;
        const imgUrlLength = imgUrl.length;
        const delFileName = fileUrl[fileUrlLength - 1];
        const delImgNmae = imgUrl[imgUrlLength - 1];
        const params = {
            Bucket: aws_config.MAIN_BUCKET,
            Delete: {
                Objects: [
                    {
                        Key: aws_config.DIRNAME + "/" + delFileName,
                    },
                    {
                        Key: aws_config.DIRNAME+ "/" + delImgNmae,
                    }
                ]
            }
        }
        s3.deleteObjects(params, (err, data) => {
            if (err) {
                console.log(err);
              } else {
                console.log('aws file delete success' + data)
              }
        });
        next();
    }
    catch(err){
        console.error(err);
    }
}
const downloadFile = (fieldName ,fileName) => {
    const signedUrlExpireSeconds = 60 * 1;
    const fileKey = fieldName + "/" + fileName;
    const url = s3.getSignedUrl('getObject', {
        Bucket: aws_config.MAIN_BUCKET,
        Key: fileKey,
        Expires: signedUrlExpireSeconds,
    });
    return url
}

module.exports = {
    uploadFile,
    deleteFile,
    downloadFile,
}
