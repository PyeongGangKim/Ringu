var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const jwt = require('jsonwebtoken');
const { secretKey } = require('../../config/jwt_secret');


const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize, book_detail, book, bank, purchase, withdrawal, member, author } = require("../../models");

router.post('/', isLoggedIn, async(req, res, next) => {
    let name = req.body.name;
    let bank = req.body.bank;
    let account = req.body.account;
    let tel = req.body.tel;
    //let description = req.body.description;
    let tax_agreement = req.body.tax_agreement;
    let promotion_agency_agreement = req.body.promotion_agency_agreement;
    let id = req.user.id;
    const t = await sequelize.transaction();

    try{
        const result = await author.create({
            name : name,
            bank : bank,
            account : account,
            //description : description,
            member_id : req.user.id,
            tax_agreement : (tax_agreement) ? 1 : 0,
            promotion_agency_agreement : (promotion_agency_agreement) ? 1 : 0,
        }, {transaction: t});

        if(result){
            const updateResult = await member.update({
                type: 1,
                tel: tel,
            },{
                where : {
                     id : id,
                },
                transaction: t
            });

            const token = jwt.sign({
                id: id,
                type: 1,
            }, secretKey, {
                expiresIn: '12h',
                issuer: 'ringu',
            });
            await t.commit();
            if(updateResult){
                res.status(StatusCodes.CREATED).json({
                    author: result,
                    token: token
                });
            }
        }
    }
    catch(err){
        console.error(err)
        await t.rollback();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }

})

router.get('/', isLoggedIn, async (req, res, next) => {
    let id = req.query.id;
    try{
        const result = await author.findOne({
            attributes: [
                "id",
                "description",
                "member_id",
                "account",
                [sequelize.literal("author.name"),"name"],
            ],
            where: {
                member_id : id
            },
            include : [
                {
                    model : bank,
                    as : "bank_bank",
                    attributes: [
                        ["id", "value"],
                        ["bank", "label"],
                    ]
                }
            ],
        });
        if(result){
            res.status(StatusCodes.OK).json({
                author: result,
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

router.get('/:authorId', isLoggedIn, async (req, res, next) => {

    let id = req.params.authorId;
    try{
        const result = await author.findOne({

            attributes: [
                "id",
                "description",
                "member_id",
                [sequelize.literal("author.name"),"name"],
            ],
            where: {
                id : id
            },
            include : {
                model : member,
                as : "member",
                attributes : [],
            }
        });
        if(result){
            res.status(StatusCodes.OK).json({
                author: result,
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



router.get('/:authorId/revenue', isLoggedIn,async (req, res, next) => {
    // book 이랑 member(작가)와 관계가 있다.
    // purchase book_detail이랑 관계가 있음.
    // athor_id가 해당 user.id와 동일한 책만 가져오기.
    let member_id = req.user.id;
    let author_id = req.params.authorId;

    try{
        const revenues = await book.findAll({
            raw: true,
            where: {
                author_id : member_id,
            },
            attributes : [
                "id",
                "price",
                [sequelize.literal("`book_details->purchases`.id"),"purchase_id"],
                [sequelize.literal("count(`book_details->purchases`.id)"), "selled_count"],
            ],
            include: [
                {
                    model: book_detail,
                    as : "book_details",
                    attributes : [],
                    include: [
                        {
                            model: purchase,
                            as : "purchases",
                            attributes:[],
                            where: {status: 1}
                        }
                    ],
                },
            ],
            group: ["book_details.id"],
        });
        console.log(revenues);
        const author_revenue = await author.findOne({
            raw: true,
            attributes: [
                "id",
                "description",
                "bank",
                "account",
                "name",
                [sequelize.literal("sum( withdrawals.amount )"), "withdrawal_amount"],
            ],
            where: {
                id : author_id,
            },
            include :[
                {
                    model: withdrawal,
                    as : "withdrawals",
                    attributes : [],
                },
            ],
        });
        console.log(author_revenue);

        let sp_amount = 0;
        let serial_amount = 0;
        for(const revenue of revenues){
            sp_amount += revenue.selled_count*revenue.price;
        }
        author_revenue.withdrawable_amount = serial_amount + sp_amount - author_revenue.withdrawal_amount;
        delete author_revenue.withdrawal_amount;
        console.log(author_revenue);
        res.status(StatusCodes.OK).json({
            author_revenue : author_revenue,
        })
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.put('/', isLoggedIn, async (req, res, next) => {
    let id = req.user.id;
    let params = req.body;
    console.log(params)
    console.log(id)
    // patch로 변경필요
    try{
        const result = await author.update(
            params,
            {
                where : {
                    member_id : id,
                }
        });
        console.log(result)
        if(result){
            var ret = {
                "message" : "update completed!",
            }

            if ('type' in params && typeof params.type !== 'undefined') {
                const token = jwt.sign({
                    id: id,
                    type: params.type,
                }, secretKey, {
                    expiresIn: '12h',
                    issuer: 'ringu',
                });
                ret['token'] = token;
            }

            res.status(StatusCodes.OK).json(ret);
        }

    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});
module.exports = router;
