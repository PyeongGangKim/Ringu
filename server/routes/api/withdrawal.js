var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize,withdrawal, account , member} = require("../../models");

router.post('/', isLoggedIn, async(req, res, next) => {
    let amount = req.body.amount * 1;
    let author_id = req.user.id;
    const t = await sequelize.transaction();
    try{
        const newWithdrawal = await withdrawal.create({
            author_id : author_id,
            amount: amount,
            status: 1,
        },
        {
            transaction : t,
        });
        const cur_account = await account.findOne({
            where: {
                author_id : author_id,
            }
        });

        let cur_account_data_values = cur_account.dataValues;
        let update_amount_available_withdrawal = cur_account_data_values.amount_available_withdrawal - amount;
        let update_request_withdrawal_amount = cur_account_data_values.request_withdrawal_amount + amount;
        await account.update({
            request_withdrawal_amount : update_request_withdrawal_amount,
            amount_available_withdrawal : update_amount_available_withdrawal,
        },
        {   
            where: {
                author_id : author_id,
            },
            transaction : t,

        });
        
        await t.commit();
        res.status(StatusCodes.CREATED).json({
            "withdrawal": newWithdrawal,
        });
    }
    catch(err){
        await t.rollback();
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
                model : member,
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
