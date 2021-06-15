var express = require("express");
var router = express.Router();

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize, cart, single_published_book, serialization_book, book, purchase, withdrawal, member, author } = require("../../models");

router.get('/', isLoggedIn, async (req, res, next) => {    
    var member_id = req.user.id;
    try{
        const result = await cart.findAll({
            attributes: [
                "id",
                [sequelize.literal("book.title"), "title"],
                [sequelize.literal("book.type"), "type"],
                [sequelize.literal("book.created_date_time"), "created_date_time"],
                [sequelize.literal("book.serialization_book_id"), "serialization_book_id"],
                [sequelize.literal("book.single_published_book_id"), "single_published_book_id"],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : {
                model : book,
                as : 'book',
                attributes : [],
            }
        });
        res.json({status: "ok", result});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get cart list"
        });
    }
});

router.delete('/:cartId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯
    var id = req.params.cartId;

    try{
        await cart.destroy({
            where : {
                id : id,
            }
        })
        res.json({status: "ok"});

    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to cancel purchasing"
        });
    }
});

module.exports = router;
