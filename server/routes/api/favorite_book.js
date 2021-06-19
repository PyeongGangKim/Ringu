var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");

const {favorite_book, author ,book, book_detail, Sequelize: {Op}, sequelize } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.post('/', isLoggedIn,async (req, res, next) => {

    var member_id = req.user.id;
    var book_id = req.body.book_id;

    try{
        const duplicate_result = await favorite_book.findOne({
            where: {
                member_id : member_id,
                book_id : book_id,
                status : 1,
            }
        })
        if(duplicate_result){
            res.status(StatusCodes.CONFLICT).send("Duplicate");
            return;
        }

        else{
            await favorite_book.create({
                member_id : member_id,
                book_id : book_id,
            });
            res.status(StatusCodes.CREATED).send("success like");
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});

router.get('/', isLoggedIn,async (req, res, next) => {
    var member_id = req.user.id;

    try{
        const favorite_books = await favorite_book.findAll({
            where : {
                member_id : member_id,
            },
            attributes : [
                [sequelize.literal("book.title"), "title"],
                [sequelize.literal("book.price"), "price"],
                [sequelize.literal("`book->author`.name"),"author"],
            ],
            include : [
                {
                    model : book,
                    as : "book",
                    attributes: [],
                    include: [
                        {
                            model: author,
                            as : "author",
                            attributes: [],

                        },
                        {
                            model: book_detail,
                            as : "book_details",
                            attributes: [],
                        }
                    ]
                }
            ]
        });
        if(favorite_books.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no content");
        }
        else{
            res.status(StatusCodes.OK).json({
                favorite_books: favorite_books
            });
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});

router.delete('/:favoriteBookId', isLoggedIn, async (req, res, next) => {

    var id = req.params.favoriteBookId;

    try{
        await favorite_book.destroy({
            where: {
                id : id,
            }
        });
        res.json({status: "ok"});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to unlike book"
        });
    }
});

module.exports = router;
