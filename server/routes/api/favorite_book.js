var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");
const {favorite_book, favorite_book_statistics, member ,book, book_detail, review_statistics, Sequelize: {Op}, sequelize } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.post('/', isLoggedIn,async (req, res, next) => {

    var member_id = req.user.id;
    var book_id = req.body.book_id;

    const t = await sequelize.transaction();
    try{
        await favorite_book.create({
                member_id : member_id,
                book_id : book_id,
        },{
            transaction : t,
        });


        const [statistics, created] = await favorite_book_statistics.findOrCreate({
            where: {
                book_id: book_id,
            },
            defaults: {
                book_id: book_id,
                favorite_person_number: 0,
            },
            transaction : t,
        });
        await favorite_book_statistics.update(
            {
                favorite_person_number : statistics.favorite_person_number + 1,
            },
            {
                where:{
                    id: statistics.id,
                },
                transaction : t,
        });
        await t.commit();
        res.status(StatusCodes.CREATED).send("success like");
    }
    catch(err){
        await t.rollback();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.get('/duplicate', isLoggedIn,async (req, res, next) => {
    var member_id = req.user.id;
    var book_id = req.query.book_id;

    try{
        const result = await favorite_book.findOne({
            where: {
                member_id : member_id,
                book_id : book_id,
                status : 1,
            }
        })
        if(result){
            res.status(StatusCodes.CONFLICT).json({
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
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/:bookId', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    var book_id = req.params.bookId;

    try {
        const fav = await favorite_book.findOne({
            where: {
                member_id: member_id,
                book_id: book_id
            }
        })

        if(fav) {
            res.status(StatusCodes.OK).json({
                "favoriteBook": fav,
            })
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
})

router.get('/', isLoggedIn,async (req, res, next) => {
    var member_id = req.user.id;

    try{
        const favoriteBookList = await favorite_book.findAll({
            where : {
                member_id : member_id,
            },
            attributes : [
                ["id", "favorite_book_id"],
                [sequelize.literal("book.id"), "id"],
                [sequelize.literal("book.type"), "type"],
                [sequelize.literal("book.is_finished_serialization"), "is_finished"],
                [sequelize.literal("book.img"), "img"],
                [sequelize.literal("book.title"), "title"],
                [sequelize.literal("book.price"), "price"],
                [sequelize.literal("`book->author`.nickname"),"author_nickname"],
                [sequelize.literal("SUM(`book->review_statistics`.score_amount) / SUM(`book->review_statistics`.person_number)"),"review_score"],
            ],
            include : [
                {
                    model : book,
                    as : "book",
                    attributes: [

                    ],

                    include: [
                        {
                            model: member,
                            as : "author",
                            attributes: [

                            ],
                        },
                        {
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [

                            ],
                        },
                    ]
                }
            ],
            group: "book.id"
        });

        if(favoriteBookList.length === 0){
            res.status(StatusCodes.NO_CONTENT).send("no content");
        }
        else{
            for(let i = 0 ; i < favoriteBookList.length ; i++){
                if(favoriteBookList[i].dataValues.img == null || favoriteBookList[i].dataValues.img[0] == 'h') continue;
                favoriteBookList[i].dataValues.img = await imageLoad(favoriteBookList[i].dataValues.img);
            }

            res.status(StatusCodes.OK).json({
                favoriteBookList: favoriteBookList
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

router.delete('/:favoriteBookId', isLoggedIn, async (req, res, next) => {
    let id = req.params.favoriteBookId;
    const t = await sequelize.transaction();
    try{
        const cancel_favorite_book = await favorite_book.findOne({
            where: {
                id : id
            },
        });

        await favorite_book.destroy({
            where: {
                id : id,
            },
            transaction: t,
        });
        let cancel_favorite_book_id = cancel_favorite_book.book_id;
        const cancel_favorite_book_statistics = await favorite_book_statistics.findOne({
            where: {
                book_id : cancel_favorite_book_id
            }
        });

        let cancel_favorite_person_number = cancel_favorite_book_statistics.favorite_person_number - 1;
        await favorite_book_statistics.update({
            favorite_person_number : cancel_favorite_person_number,
        },{
            where : {
                book_id : cancel_favorite_book_id,
            },
            transaction : t,
        });
        res.status(StatusCodes.OK).json({
            "message" : "OK",
        });
        await t.commit();
    }
    catch(err){
        await t.rollback();
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("error");
    }
});

module.exports = router;
