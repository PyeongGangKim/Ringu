var express = require("express");
var router = express.Router();

const StatusCodes = require("../../helper/statusCodes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize,withdrawal, account, author, purchase, book_detail, book, member, Sequelize: {Op} } = require("../../models");

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

/*router.post('/', isLoggedIn, async(req, res, next) => {
    let amount = parseInt(req.body.amount);
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

        const purchases = await purchase.findAll({
            attributes: [
                "id"
            ],
            where: {
                status: 1,
                remit_status: 0,
            },
            include: [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {
                                author_id: author_id
                            },
                            attributes: [],
                        }
                    ]
                },
            ],
        })

        const purchaseUpdate = await purchase.update(
            {
                remit_status: 1,
                withdrawal_id: newWithdrawal.id,
            },
            {
                where: {
                    id: {
                        [Op.in]: purchases.map(p => p.id),
                    }
                },
                transaction: t,
            }
        )

        const authorUpdate = await author.update(
            {
                is_waiting: 1,
            },
            {
                where:{
                    member_id: author_id,
                },
                transaction: t,
            }
        )

        if(authorUpdate && purchaseUpdate && newWithdrawal) {
            await t.commit();
            res.status(StatusCodes.CREATED).json({
                "withdrawal": newWithdrawal,
            });
        }
    }
    catch(err){
        await t.rollback();
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});*/

router.get('/', isLoggedIn, isAuthor,async (req, res, next) => {
    // POST
    let author_id = req.query.author_id;
    try{
        const result = await withdrawal.findAll({
            attributes : [
                "id",
                "amount",
                "created_date_time",
                "is_remittance",
                "remitted_date_time",
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
                withdrawals : result,
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
