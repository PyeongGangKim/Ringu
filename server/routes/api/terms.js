let express = require("express");
let router = express.Router();

const StatusCodes = require("../../helper/statusCodes");
const { getImgURL } = require("../../utils/aws");
const {terms, Sequelize: {Op}, sequelize } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.get('/',async (req, res, next) => {

    let termsType = req.query.type;
    
    try{
        const term = await terms.findAll({
            where: {
                title: termsType,
            }
        });
        res.status(StatusCodes.OK).json({
            term: term
        });
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});

module.exports = router;
