const env = process.env.NODE_ENV !== "production" ? "development" : "prodution";
const aws_config = require("../config/aws")[env];


const getImgURL = (img_name) => {
    return aws_config.AWS_IMG_BUCKET_URL + img_name
};

module.exports = {
    getImgURL
};