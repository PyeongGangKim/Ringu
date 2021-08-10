var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");
const {favorite_book, favorite_book_statistics, member ,book, book_detail, review_statistics, Sequelize: {Op}, sequelize } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.post('/', isLoggedIn,async (req, res, next) => {

    var member_id = req.user.id;
    var book_id = req.body.book_id;

    try{
        const result = await sequelize.transaction(async (t) => {
            await favorite_book.create({
                member_id : member_id,
                book_id : book_id,
            });
            const [statistics, created] = await favorite_book_statistics.findOrCreate({
                where: {
                    book_id: book_id,
                },
                defaults: {
                    book_id: book_id,
                    favorite_person_number: 0,
                }
            });
            await favorite_book_statistics.update(
                {
                    favorite_person_number : statistics.favorite_person_number + 1,
                },
                {
                    where:{
                        id: statistics.id,
                },
            });
            res.status(StatusCodes.CREATED).send("success like");
        });
    }

    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.post('/duplicate', isLoggedIn,async (req, res, next) => {
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
            res.status(StatusCodes.OK).send("No Duplicate");
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
        const favoriteBookList = await favorite_book.findAll({
            where : {
                member_id : member_id,
            },
            attributes : [
                "id",
                [sequelize.literal("book.id"), "book_id"],
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
                        "img",
                        "title",
                        "price",
                    ],

                    include: [
                        {
                            model: member,
                            as : "author",
                            attributes: [
                                "nickname",
                            ],
                        },
                        {
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [
                                "score_amount",
                                "person_number",
                            ],
                        },
                    ]
                }
            ],
            group: "book.id"
        });

        if(favoriteBookList.length == 0){
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

    var id = req.params.favoriteBookId;

    try{
        await favorite_book.destroy({
            where: {
                id : id,
            }
        });
        res.status(StatusCodes.OK);
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
