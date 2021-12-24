let express = require("express");
let router = express.Router();

const StatusCodes = require("../../helper/statusCodes");
const logger = require('../../utils/winston_logger');
const {terms, Sequelize: {Op}, sequelize } = require("../../models");




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
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        
    }
});

module.exports = router;
