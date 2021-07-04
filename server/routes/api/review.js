var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { isLoggedIn } = require("../../middlewares/auth");


const { book_detail,review_statistics ,sequelize,review , member, book, Sequelize : {Op}} = require("../../models");


router.post('/' ,isLoggedIn, async (req, res, next) => {//review 쓰기

    let member_id = req.user.id;
    let author_id = req.body.author_id;
    let book_id = req.body.book_id;
    let book_detail_id = req.body.book_detail_id;
    let score = req.body.score;
    let description = req.body.description;

    try{
        const duplicate_result = await review.findOne({
            where : {
                member_id : member_id,
                book_detail_id : book_detail_id,
                status : 1,
            }
        });
        if(duplicate_result){
            res.status(StatusCodes.CONFLICT).send("Duplicate");
            return;
        }
        const result = await sequelize.transaction(async (t) => {
            await review.create({
                member_id : member_id,
                author_id : author_id,
                book_detail_id : book_detail_id,
                score : score,
                description : description,
            });
            const [statistics, created] = await review_statistics.findOrCreate({
                where: {
                    book_detail_id: book_detail_id,
                },
                defaults: {
                    author_id : author_id,
                    book_id: book_id,
                    book_detail_id: book_detail_id,
                    score_amount: 0,
                    person_number: 0,
                }
            });
            await review_statistics.update(
                {
                    score_amount : statistics.score_amount + Number(score),
                    person_number : statistics.person_number + 1,
                },
                {
                    where:{
                        id: statistics.id,
                },
            });
            res.status(StatusCodes.CREATED).send("review CREATED");
        });


    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
        await t.rollback();
    }
});

router.get('/', isLoggedIn, async (req, res, next) => { // 자기가 쓴 review api 가져오기 author name가져오는 거 구현 필요.
    var member_id = req.user.id;
    try{
        const review_list = await review.findAll({
            attributes: [
                "score",
                "description",
                "created_date_time",
                [sequelize.literal("book_detail.title"),"title"],
                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : 'book_detail',
                    attributes: [],
                    include: [
                        {
                            model: book,
                            as : 'book',
                            attributes : [],
                            include : [
                                {
                                    model: member,
                                    as: 'author',
                                    attributes: [],
                                }
                            ]
                        }
                    ]
                },

            ]
        });
        if(review_list.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no review");
        }
        else{
            res.status(StatusCodes.OK).json({
                review_list : review_list,
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

router.get('/author/:author_id', async (req, res, next) => { // 자기가 쓴 review api 가져오기 author name가져오는 거 구현 필요.
    var author_id = req.params.author_id

    try{
        const review_list = await review.findAll({
            attributes: [
                "score",
                "description",
                "created_date_time",
                [sequelize.literal("book_detail.title"),"title"],
                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],

            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : 'book_detail',
                    attributes: [],
                    include: [
                        {
                            model: book,
                            as : 'book',
                            attributes : [],
                            where: {
                                author_id: author_id,
                            },
                            include : [
                                {
                                    model: member,
                                    as: 'author',
                                    attributes: [],
                                }
                            ]
                        }
                    ]
                },

            ]
        });
        if(review_list.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no review");
        }
        else{
            res.status(StatusCodes.OK).json({
                review_list : review_list,
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

router.get('/book/:book_id', async (req, res, next) => { // 자기가 쓴 review api 가져오기 author name가져오는 거 구현 필요.
    var book_id = req.params.book_id
    console.log(req.params)

    try{
        const reviewList = await review.findAll({
            attributes: [
                "score",
                "description",
                "created_date_time",
                [sequelize.literal("book_detail.title"),"title"],
                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],

            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : 'book_detail',
                    attributes: [],
                    where: {
                        book_id: book_id,
                    },
                    include: [
                        {
                            model: book,
                            as : 'book',
                            attributes : [],
                            include : [
                                {
                                    model: member,
                                    as: 'author',
                                    attributes: [],
                                }
                            ]
                        }
                    ]
                },

            ]
        });
        if(reviewList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no review");
        }
        else{
            res.status(StatusCodes.OK).json({
                reviewList : reviewList,
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
