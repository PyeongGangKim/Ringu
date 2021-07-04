var multer = require("multer");
var AWS = require("aws-sdk");
const {ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, BUCKET, DIRNAME} = require("../config/aws");
const fs=require('fs');

module.exports = {
    "upload" : (file_object, newFileName, callback) => {
        // configuring the DiscStorage engine.
        const storage = multer.diskStorage({
            destination : 'uploads/',
            filename: function (req, file, cb) {
              cb(null, file.originalname);
            }
        });
        const upload = multer({ storage: storage });

        AWS.config.update({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY,
            region: REGION,
        });

        //Creating a new instance of S3:
        const s3 = new AWS.S3();

        uploadFile(file_object, newFileName)

        //The uploadFile function
        function uploadFile(source,targetName){
            console.log('preparing to upload...');
            fs.readFile(source, function (err, filedata) {
                if (!err) {
                    const putParams = {
                        Bucket      : BUCKET+"/"+DIRNAME,
                        Key         : targetName,
                        Body        : filedata
                    };
                    s3.putObject(putParams, function(err, data){
                        if (err) {
                            console.log('Could nor upload the file. Error :',err);
                            // return res.send({success:false});
                        }
                        else{
                            callback(newFileName);
                            // fs.unlink(source);// Deleting the file from uploads folder(Optional).Do Whatever you prefer.
                            console.log('Successfully uploaded the file');
                            // return res.send({success:true});
                        }
                    });
                }
                else{
                    console.log({'err':err});
                }
            });
        }
    }
};
