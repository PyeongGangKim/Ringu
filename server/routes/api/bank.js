var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");


const { isLoggedIn } = require("../../middlewares/auth");
const { sequelize, bank } = require("../../models");

router.get('/', async (req, res, next) => {
    try{
        const result = await bank.findAll({
            attributes: [
                ["id", "value"],
                ["bank", "label"],
            ]
        });

        if(result){
            res.status(StatusCodes.OK).json({
                bank: result,
            });
        }
        else{
            res.status(StatusCodes.NO_CONTENT).json({
                "message" : "NO_CONTENT",
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

module.exports = router;
