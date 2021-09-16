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
    }
});
router.get('/duplicate' ,isLoggedIn, async (req, res, next) => { // duplicate 체크
    let member_id = req.user.id;
    let book_detail_id = req.body.book_detail_id;
    try{
        const result = await review.findOne({
            where : {
                member_id : member_id,
                book_detail_id : book_detail_id,
                status : 1,
            }
        });

        if(result){
            res.status(StatusCodes.OK).json({
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



router.get('/', async (req, res, next) => { // 자기가 쓴 review api 가져오기 author name가져오는 거 구현 필요.
    try{
        var member_id = ("member_id" in req.query && req.query.member_id !== null) ? req.query.member_id : null;
        var author_id = ("author_id" in req.query && req.query.author_id !== null) ? req.query.author_id : null;
        var book_id =   ("book_id" in req.query && req.query.book_id !== null) ? req.query.book_id : null;
        var time =      ("time" in req.query && req.query.time !== null) ? req.query.time : 0;

        var offset = time * 5;
        var limit = 5;

        var where = {
            status: 1,
        }

        if (member_id !== null) {
            where['$member_id$'] = member_id
        }
        else if (author_id !== null) {
            where['$author_id$'] = author_id
        }
        else if (book_id !== null) {
            where['$book_id$'] = book_id
        }

        const getReviewList = async(where, distinct) => {
            var attr = []
            var group = []
            if (distinct) {
                attr = [
                    [sequelize.literal("`book_detail->book`.id"),"book_id"],
                    [sequelize.literal("`book_detail->book`.title"),"book_title"],
                ]
                group = ['book_title']
            }
            else {
                attr = [
                    "id",
                    "score",
                    "description",
                    "created_date_time",
                    [sequelize.literal("member.nickname"),"nickname"],
                    [sequelize.literal("book_detail.id"),"detail_id"],
                    [sequelize.literal("book_detail.title"),"subtitle"],
                    [sequelize.literal("`book_detail->book`.id"),"book_id"],
                    [sequelize.literal("`book_detail->book`.type"),"book_type"],
                    [sequelize.literal("`book_detail->book`.title"),"book_title"],
                    [sequelize.literal("`book_detail->book->author`.nickname"),"author"],
                ]
            }
            const list = await review.findAll({
                attributes: attr,
                where: where,
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
                    {
                        model : member,
                        as : 'member',
                        attributes: [],
                    }
                ],
                group: group,
                limit: limit,
                offset: offset,
            });

            return list
        }
        const reviewList = await getReviewList(where, false)
        var reviewTitleList = null;

        if (req.query.title !== null && req.query.title === 'true') {
            reviewTitleList = await  getReviewList(where, true)
        }



        if(reviewList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no review");
        }
        else{
            res.status(StatusCodes.OK).json({
                reviewList : reviewList,
                reviewTitleList : reviewTitleList,
                reviewListLength: reviewList.length,
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

router.get('/stats', async (req, res, next) => {
    var id = req.body.id;
    var group = req.body.group;

    var where = {
    }

    if(group === 'author_id') {
        where['author_id'] = id
    } else if (group === 'book_id') {
        where['book_id'] = id
    } else if (group === 'book_detail_id') {
        where['book_detail_id'] = id
    }

    try {
        const stats = await review_statistics.findAll({
            attributes: [
                [sequelize.literal("SUM(score_amount)"),"total"],
                [sequelize.literal("SUM(person_number)"),"count"],
            ],
            where: where,
            group: group,
        })
        if(stats.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                stats: stats,
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

/*router.get('/author/:author_id', async (req, res, next) => { // 자기가 쓴 review api 가져오기 author name가져오는 거 구현 필요.
    var author_id = req.params.author_id

    try{
        const reviewList = await review.findAll({
            attributes: [
                "score",
                "description",
                "created_date_time",
                [sequelize.literal("book_detail.id"),"detail_id"],
                [sequelize.literal("book_detail.title"),"subtitle"],
                [sequelize.literal("`book_detail->book`.id"),"book_id"],
                [sequelize.literal("`book_detail->book`.title"),"book_title"],
                [sequelize.literal("`book_detail->book`.author_id"),"author_id"],
                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],

            ],
            where: {
                status : 1,
                '$author_id$': author_id
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
                            //where: {
                            //    author_id: author_id,
                            //},
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

router.get('/book/:book_id', async (req, res, next) => { // 자기가 쓴 review api 가져오기 author name가져오는 거 구현 필요.
    var book_id = req.params.book_id

    try{
        const reviewList = await review.findAll({
            attributes: [
                "score",
                "description",
                "created_date_time",
                [sequelize.literal("book_detail.id"),"detail_id"],
                [sequelize.literal("book_detail.title"),"subtitle"],
                [sequelize.literal("`book_detail->book`.id"),"book_id"],
                [sequelize.literal("`book_detail->book`.title"),"book_title"],
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
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});*/


router.delete('/:reviewId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯


    var id = req.params.reviewId;

    try{
        await review.destroy({
            where : {
                id : id,
            }
        })
        res.status(StatusCodes.OK);

    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
