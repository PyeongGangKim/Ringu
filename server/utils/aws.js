const {AWS_IMG_BUCKET_URL} = require("../config/aws");

const getImgURL = (img_name) => {
    return AWS_IMG_BUCKET_URL + img_name
};

module.exports = {
    getImgURL
};