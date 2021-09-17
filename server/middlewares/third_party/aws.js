const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const {ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, BUCKET, DIRNAME} = require("../../config/aws");
const { book } = require("../../models");

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
});

const storage = multerS3({
    s3: s3,

    bucket: function(req,file, cb){
        cb(null, BUCKET+ "/" + file.fieldname);
    },
    contentType: function(req, file, cb){
        let fieldName = file.fieldname;
        if(fieldName == "img"){
            cb(null,file.mimetype);
        }
        else cb(null, "application/octet-stream");
    },

    key: function (req, file, cb) {
        const fileNameSplit = file.originalname.split('.');
        var fileName = ""
        for(var i=0; i < fileNameSplit.length-1; i++) {
            fileName += fileNameSplit[i]
        }
        fileName += "_" + Date.now().toString() + "." + fileNameSplit[fileNameSplit.length-1]

        cb(null, fileName);
    }, // 파일 이름
    acl: 'public-read',
});

const upload = multer({
    storage: storage
})

const uploadFile = upload.fields([
    {name: 'file', maxCount: 1},
    {name: 'img', maxCount: 1},
    {name: 'preview', maxCount: 1},
]);

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
            Bucket: BUCKET,
            Delete: {
                Objects: [
                    {
                        Key: DIRNAME + "/" + delFileName,
                    },
                    {
                        Key: DIRNAME+ "/" + delImgNmae,
                    }
                ]
            }
        }
        s3.deleteObjects(params, (err, data) => {
            if (err) {
                console.log('aws file delete error')
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
    const signedUrlExpireSeconds = 60 * 5;
    const fileKey = fieldName + "/" + fileName;
    const url = s3.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: fileKey,
        Expires: signedUrlExpireSeconds,
    });
    return url
}
const imageLoad = (imgName) => {
    if (imgName === null) {
        return null;
    }
    const signedUrlExpireSeconds = 3600 * 24;
    const fileKey = "img/" + imgName;
    const url = s3.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: fileKey,
        Expires: signedUrlExpireSeconds
    });
    return url;
}
module.exports = {
    uploadFile,
    deleteFile,
    downloadFile,
    imageLoad,
}
