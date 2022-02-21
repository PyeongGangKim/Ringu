var express = require("express");
var router = express.Router();
const logger = require('../../utils/winston_logger');
const StatusCodes = require("../../helper/statusCodes");
const { isLoggedIn } = require("../../middlewares/auth");
const { getImgURL } = require("../../utils/aws");
const { sequelize, cart, book, book_detail, purchase, withdrawal, member, author } = require("../../models");

router.post('/', isLoggedIn,async (req, res, next) => {
    var member_id = req.user.id;
    var book_detail_id = req.body.book_detail_id;

    try{
        await cart.create({
                member_id : member_id,
                book_detail_id : book_detail_id,
        });

        res.status(StatusCodes.CREATED).send("success cart");
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        
    }
});

router.get('/duplicate', isLoggedIn,async (req, res, next) => {
    var member_id = req.user.id;
    var book_detail_id = req.query.book_detail_id;

    try{
        const result = await cart.findOne({
            where: {
                member_id : member_id,
                book_detail_id : book_detail_id,
                status : 1,
            }
        })
        if(result){
            res.status(StatusCodes.DUPLICATE).json({
                "message" : "duplicate",
            });
        }
        else{
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;

    try{
        const cartList = await cart.findAll({
            attributes: [
                "id",
                [sequelize.literal("`book_detail->book`.id"), "book_id"],
                [sequelize.literal("`book_detail->book`.title"), "book_title"],
                "created_date_time",
                [sequelize.literal("`book_detail->book`.price"), "price"],
                [sequelize.literal("`book_detail->book`.img"), "img"],
                [sequelize.literal("book_detail.id"), "book_detail_id"],
                [sequelize.literal("book_detail.round"), "round"],
                [sequelize.literal("book_detail.title"), "title"],
                [sequelize.literal("`book_detail->book`.type"), "type"],
                [sequelize.literal("`book_detail->book`.serialization_day"), "serialization_day"],
                [sequelize.literal("`book_detail->book`.is_finished_serialization"), "is_finished_serialization"],
                [sequelize.literal("`book_detail->book`.description"), "book_description"],
                [sequelize.literal("`book_detail->book->author`.id"), "author_id"],
                [sequelize.literal("`book_detail->book->author`.nickname"), "author_nickname"],
                [sequelize.literal("book_detail.page_number"),"page_count"],
                [sequelize.literal("book_detail.file"),"file"],

            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : {
                model : book_detail,
                as : 'book_detail',
                attributes: [],
                include : [
                    {
                        model: book,
                        as : 'book',
                        attributes : [],
                        include : [
                            {
                                model: member,
                                as : 'author',
                                attributes : [],
                            }
                        ]
                    }
                ]
            }
        });
        if(cartList.length === 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");
        }
        else{
            for(let cart of cartList){
                if(cart.dataValues.img== null || cart.dataValues.img[0] == 'h') continue;
                cart.dataValues.img = getImgURL(cart.dataValues.img);
            }
            res.status(StatusCodes.OK).json({
                cartList : cartList,
            });
        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        
    }
});

router.put('/clear', isLoggedIn, async (req, res, next) => {
    try {
        var member_id = req.params.member_id
        var book_detail_id = req.params.book_detail_id

        const res = await cart.update({
            status: 0,
        },
        {
            where: {
                member_id: member_id,
                book_detail_id: {
                    [Op.in] : book_detail_id,
                },
            },
        })

    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server_error",
        });
    }
});

router.delete('/', isLoggedIn, async (req, res, next) => {
    var id = req.query.id;

    try{
        await cart.destroy({
            where : {
                id : id,
            }
        })
        res.status(StatusCodes.OK).json({
            "message" : "OK",
        });

    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server_error",
        });
    }
});

module.exports = router;
