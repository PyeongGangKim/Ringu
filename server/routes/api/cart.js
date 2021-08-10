var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { isLoggedIn } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");
const { sequelize, cart, book, book_detail, purchase, withdrawal, member, author } = require("../../models");


router.get('/', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;

    try{
        const cartList = await cart.findAll({
            attributes: [
                "id",
                "created_date_time",
                [sequelize.literal("book_detail.title"), "book_detail_title"],

                // 임시
                [sequelize.literal("`book_detail->book`.title"), "book_title"],
                [sequelize.literal("`book_detail->book`.type"), "type"],
                [sequelize.literal("`book_detail->book`.is_finished_serialization"), "is_finished"],
                [sequelize.literal("`book_detail->book`.description"), "book_description"],
                [sequelize.literal("`book_detail->book`.serialization_day"), "serialization_day"],
                [sequelize.literal("`book_detail->book`.title"), "book_title"],
                [sequelize.literal("`book_detail->book`.price"), "price"],
                [sequelize.literal("`book_detail->book`.img"), "img"],
                [sequelize.literal("`book_detail->book->author`.nickname"), "author_name"],
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
        if(cartList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");
        }
        else{
            for(let cart of cartList){
                if(cart.dataValues.img== null || cart.dataValues.img[0] == 'h') continue;
                cart.dataValues.img = await imageLoad(cart.dataValues.img);
            }
            res.status(StatusCodes.OK).json({
                cartList : cartList,
            });
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
        /*
        res.json({status: "ok", cartList});
    }

    catch(err){
        console.log(err)
        res.json({
            status: "error",
            error: err,
            reason: "fail to get cart list"
        });
    }*/
});

router.delete('/:cartId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯
    var id = req.params.cartId;

    try{
        await cart.destroy({
            where : {
                id : id,
            }
        })
        res.status(StatusCodes.OK);

    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
