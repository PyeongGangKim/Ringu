var express = require("express");
var router = express.Router();

const { isLoggedIn } = require("../../middlewares/auth");


const {sequelize,review , member, book, Sequelize : {Op}} = require("../../models");

router.post('/' ,isLoggedIn, async (req, res, next) => {

    let member_id = req.body.member_id;
    let book_id = req.body.book_id;

    try{
        const duplicate_result = await review.findOne({
            where : {
                member_id : member_id,
                book_id : book_id,
                status : 1,
            }
        });
        if(duplicate_result){
            res.json({
                status: "error",
                reason: "duplicate"
            });
            return;
        }
        const result = await review.create({
            member_id : member_id,
            book_id : book_id,
            score : score,
            description : description,
        });
        res.json({status: "ok", result});

    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to write the review"
        });
    }
});

router.get('/member', isLoggedIn, async (req, res, next) => {
    var member_id = req.query.member_id;
    try{
        const member_reviews = await review.findAll({
            where: {
                member_id : member_id,
                status : 1,
            },
            include : {
                model : book,
                as : 'book',
            }
        });
        res.json({status: "ok", member_reviews});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get review list"
        });
    }
});
router.get('/book', async (req, res, next) => {
    let book_id = req.query.book_id;
    try{
        const book_reviews = await review.findAll({
            attributes: [
                "score",
                "description",
                [sequelize.literal("member.name"),"reviewer"],
                [sequelize.literal("book.title"), "title"],
            ],
            where: {
                book_id : book_id,
                status : 1,
            },
            include : [
                {
                    model : book,
                    as : "book",
                    attributes: [],
                },
                {
                    model : member,
                    as : "member",
                    attributes: [],
                }
            ]
        });
        res.json({status: "ok", book_reviews});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get review list"
        });
    }
});
router.delete('/:reviewId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯


    var id = req.params.reviewId;

    try{
        await review.destroy({
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
