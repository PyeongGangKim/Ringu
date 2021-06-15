var express = require("express");
var router = express.Router();


var helper_api = require("../../helper/api");
const { isLoggedIn, isAuthor } = require("../../middlewares/auth");


const {single_published_book, serialization_book, sequelize, author, member, purchase, book, Sequelize : {Op}} = require("../../models");




router.post('/' ,isLoggedIn, async (req, res, next) => {
    var member_id = req.body.member_id;
    var book_id = req.body.book_id;
    try{
        const duplicate_result = await purchase.findOne({
            where : {
                member_id : member_id,
                book_id : book_id,
                status: 1,
            }
        });
        if(duplicate_result){
            res.json({
                status: "error",
                reason: "duplicate"
            });
            return;
        }
        const result = await purchase.create({
            member_id : member_id,
            book_id : book_id,
        })
        res.json({status: "ok", result});

    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to purchase"
        });
    }
});
router.post('/many' , isLoggedIn, async (req, res, next) => { // 모두 구매
    try{
        let purchaseList = req.body.purchaseList;
        const result = await purchase.bulkCreate(
            purchaseList,
        );
        res.json({status: "ok", result});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to purchase"
        });
    }
});

router.get('/', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    
    try{
        const result = await purchase.findAll({
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
            reason: "fail to get purchasing list"
        });
    }
});
router.get('/sellingList', isLoggedIn, isAuthor,async (req, res, next) => {
    var author_id = req.query.author_id;
    try{
        const serialization_book_selling_list = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                "member_id",
                "book_id",
                [sequelize.literal("book.title"), "title"],
                [sequelize.literal("`book->serialization_book`.price"),"price"],
                [sequelize.literal("member.name"), "buyer_name"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book,
                    as : "book",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: serialization_book,
                            as : "serialization_book",
                            where : {author_id: author_id},
                            attributes: [],
                        }
                    ]
                },
                {
                    model : member,
                    as: "member",
                    attributes : [],
                }
            ],
        });
        const single_published_book_selling_list = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                "book_id",
                "member_id",
                [sequelize.literal("book.title"), "title"],
                [sequelize.literal("`book->single_published_book`.price"),"price"],
                [sequelize.literal("member.name"), "buyer_name"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book,
                    as : "book",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: single_published_book,
                            as : "single_published_book",
                            where : {author_id: author_id},
                            attributes: [],
                        }
                    ]
                },
                {
                    model : member,
                    as: "member",
                    attributes : [],
                }
            ],

        });
        res.json({status: "ok", serialization_book_selling_list, single_published_book_selling_list});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get selling list"
        });
    }
});


router.delete('/:purchaseId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯


    var id = req.params.purchaseId;

    try{
        await purchase.destroy({
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
