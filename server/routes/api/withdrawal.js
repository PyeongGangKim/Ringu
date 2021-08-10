var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize,withdrawal, member ,author } = require("../../models");

router.post('/', isLoggedIn, async(req, res, next) => {
    let amount = req.body.amount;
    let author_id = req.body.author_id;
    try{
        const newWithdrawal = await withdrawal.create({
            author_id : author_id,
            amount: amount,
            status: 1,
        });
        res.status(StatusCodes.CREATED).json({
            "withdrawal": newWithdrawal,
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

router.get('/', isLoggedIn, isAuthor,async (req, res, next) => {

    // POST
    let author_id = req.query.author_id;
    try{
        const result = await withdrawal.findAll({
            attributes : [
                [sequelize.literal("author.name"),"name"],
                "amount",
            ]
            ,where: {
                author_id : author_id,
            },
            include : {
                model : author,
                as : "author",
                attributes : [],
            }
        });
        if(result){
            res.status(StatusCodes.OK).json({
                "withdrawal_list" : result,
            })
        }
        else{
            res.status(StatusCodes.NO_CONTENT)
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    // DB LOAD
    
});


module.exports = router;
