var express = require("express");
var router = express.Router();
var moment = require("moment");

const StatusCodes = require("../../helper/statusCodes");
const { isLoggedIn, isAuthor } = require("../../middlewares/auth");

const logger = require('../../utils/winston_logger');
const { getImgURL } = require("../../utils/aws");
const {account, book_detail, sequelize, member, purchase, book, review, review_statistics, Sequelize : {Op}} = require("../../models");
const {kakaopay} = require("../../config/pay.js");
const url = require("../../config/url.js");
const request = require("request");



router.post('/' ,isLoggedIn, async (req, res, next) => { // 구매 생성 api

    let book_detail_id = req.body.book_detail_id;
    let payment_id = req.body.payment_id;

    const t = await sequelize.transaction();
    try{
        //book_detail_id로 수수료 가져와서 purchase할 때, withdrawal에 저장.
        //purchase 만들고, 그리고 해당 purchase에 대한 내용 transaction 사용해서, account에 추가

        const purchased_book = await book_detail.findOne({
            attributes : [
                "id",
                [sequelize.literal("book.charge"), "charge"],
                [sequelize.literal("book.price"), "price"],
                [sequelize.literal("book.author_id"), "author_id"],
            ],
            where: {
                id : book_detail_id,
            },
            include: [
                {
                    model : book,
                    as : "book",
                    attributes: []
                }

            ],
            transaction: t,
        });

        let author_id = purchased_book.dataValues.author_id;
        let price = purchased_book.dataValues.price;
        let charge = purchased_book.dataValues.charge;

        await purchase.create({
            member_id : author_id,
            book_detail_id : book_detail_id,
            price: price,
            payment_id : payment_id,
        },
        {
            transaction: t,
        });
        let earned_money = price - (price * (charge / 100));

        let [author_account, created] = await account.findOrCreate({
            where : {
                author_id : author_id,
            },
            defaults : {
                author_id : author_id,
                total_earned_money : earned_money,
                total_withdrawal_amount: 0,
                amount_available_withdrawal: earned_money
            },
            transaction : t,
        });

        if(!created){
            let update_total_earned_money = author_account.total_earned_money + earned_money;
            let update_amount_available_withdrawal = author_account.amount_available_withdrawal + earned_money;
            await account.update({
                total_earned_money: update_total_earned_money,
                amount_available_withdrawal : update_amount_available_withdrawal,
            },
            {
                where: {
                    id: author_account.id,
                },
                transaction: t,
            });
        }
        await t.commit();
        res.status(StatusCodes.OK).send("success purchasing");

    }
    catch(err){
        await t.rollback();
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        
    }
});

router.get('/duplicate' ,isLoggedIn, async (req, res, next) => { // duplicate 체크

    let member_id = req.query.member_id;
    let book_detail_id = req.query.book_detail_id;

    try{
        const result = await purchase.findOne({
            where : {
                member_id : member_id,
                book_detail_id : book_detail_id,
                status: 1,
            }
        });
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
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});
router.post('/many' , isLoggedIn, async (req, res, next) => { // 모두 구매
    try{
        let purchaseList = req.body.purchaseList;
        const result = await purchase.bulkCreate(
            purchaseList,
        );

        res.status(StatusCodes.OK).send("success purchasing");
    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        
    }
});

router.get('/', isLoggedIn, async (req, res, next) => {// 구매한 리스트 가져오기
    var member_id = req.user.id;

    try{
        const purchaseList = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                [sequelize.literal("book_detail.id"), "book_detail_id"],
                [sequelize.literal("book_detail.title"), "subtitle"],
                [sequelize.literal("book_detail.file"), "file"],

                [sequelize.literal("`book_detail->book`.title"), "title"],
                [sequelize.literal("`book_detail->book`.price"), "price"],
                [sequelize.literal("`book_detail->book`.type"), "type"],

                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],

                [sequelize.literal("`book_detail->reviews`.id"), "review"],
                [sequelize.literal("`book_detail->book`.img"), "img"],
                [sequelize.literal("`book_detail->review_statistics`.score_amount / `book_detail->review_statistics`.person_number"),"review_score"],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : 'book_detail',
                    attributes: [
                        /*
                        "id",
                        "title",
                        "file",*/
                    ],
                    include: [
                        {
                            model: book,
                            as : 'book',
                            attributes : [
                                /*
                                "title",
                                "price",
                                "type",*/
                            ],
                            include : [
                                {
                                    model: member,
                                    as: 'author',
                                    attributes: [
                                        /*
                                        "nickname",*/
                                    ],
                                }
                            ]
                        },
                        {   //review가 필요한가?
                            model: review,
                            as : "reviews",
                            attributes: [
                                /*
                                "id",*/
                            ],
                            required: false,
                            where: {
                                member_id: member_id,
                            },
                        },
                        {
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [
                                /*
                                "score_amount",
                                "person_number",*/
                            ],
                        }
                    ]
                },
            ]
        });

        if(purchaseList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");
        }
        else{
            for(let i = 0 ; i < purchaseList.length ; i++){
                if(purchaseList[i].dataValues.img== null || purchaseList[i].dataValues.img[0] == 'h') continue;
                purchaseList[i].dataValues.img = getImgURL(purchaseList[i].dataValues.img);
            }
            res.status(StatusCodes.OK).json({
                purchaseList : purchaseList,
            });
        }
    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/sales', isLoggedIn, isAuthor,async (req, res, next) => { //작가 입장에서 판 책들 가져오기
    var author_id = req.query.author_id;
    var year = parseInt(req.query.year);

    try{
        const sales = await sequelize.query(
            `
                SELECT
                    YEAR(p.created_date_time) as y,
                    MONTH(p.created_date_time) as m,
                    SUM(p.price) as revenue
                FROM purchase p JOIN book_detail d ON p.book_detail_id = d.id JOIN book b ON d.book_id = b.id
                WHERE b.author_id = ${author_id}
                    AND p.status = 1
                GROUP BY y, m
                HAVING y = ${year}
            `,
             {type: sequelize.QueryTypes.SELECT}
        )

        const years = await purchase.findAll({
            attributes: [
                [sequelize.literal("YEAR(purchase.created_date_time)"), "y"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {
                                author_id: author_id
                            },
                            attributes: [],
                        }
                    ]
                },
            ],
            group: [
                ["y"]
            ],
        });

        if(sales.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                sales : sales,
                years : years,
            });
        }

    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/sales/ratio', isLoggedIn, isAuthor,async (req, res, next) => { //작가 입장에서 판 책들 가져오기
    var author_id = req.query.author_id;

    try{
        const sales = await purchase.findAll({
            attributes: [
                [sequelize.literal("SUM(purchase.price)"), "value"],
                [sequelize.literal("COUNT(*)"), "count"],
                [sequelize.literal("`book_detail->book`.title"), "book_title"]
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {
                                author_id: author_id
                            },
                            attributes: [],
                        }
                    ]
                },
            ],
            group: [
                [sequelize.literal("`book_detail->book`.title")]
            ],
            limit: 5
        });

        const total = await purchase.findAll({
            attributes: [
                [sequelize.literal("SUM(purchase.price)"), "value"],
                [sequelize.literal("COUNT(*)"), "count"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {
                                author_id: author_id
                            },
                            attributes: [],
                        }
                    ]
                },
            ],
        });

        if(sales.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                sales : sales,
                total : total,
            });
        }

    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/sales/book', isLoggedIn, isAuthor,async (req, res, next) => { //작가 입장에서 판 책들 가져오기
    var author_id = req.query.author_id;
    var year = parseInt(req.query.year);
    var result = {}

    try{
        const books = await sequelize.query(
            `
                SELECT title as book_title, id
                FROM (
                SELECT
                    YEAR(p.created_date_time) as y,
                    b.title,
                    b.id,
                    SUM(p.price) as revenue
                FROM purchase p JOIN book_detail d ON p.book_detail_id = d.id JOIN book b ON d.book_id = b.id
                WHERE b.author_id = ${author_id}
                    AND p.status = 1
                GROUP BY y, b.id
                HAVING y = ${year}
                ) A
                ORDER BY revenue DESC
                LIMIT 5
            `,
             {type: sequelize.QueryTypes.SELECT}
        )

        result['books'] = books

        if(books.length !== 0) {
            var top5 = books.map(book => book.id)
            const sales = await sequelize.query(
                `
                    SELECT
                        YEAR(p.created_date_time) as y,
                        MONTH(p.created_date_time) as m,
                        b.title as book_title,
                        b.id,
                        SUM(p.price) as revenue
                    FROM purchase p JOIN book_detail d ON p.book_detail_id = d.id JOIN book b ON d.book_id = b.id
                    WHERE b.author_id = ${author_id}
                        AND p.status = 1
                        AND b.id IN (${top5})
                    GROUP BY book_title, y, m
                    HAVING y = ${year}

                    UNION

                    SELECT
                        YEAR(p.created_date_time) as y,
                        MONTH(p.created_date_time) as m,
                        'etc.',
                        b.id,
                        SUM(p.price) as revenue
                    FROM purchase p JOIN book_detail d ON p.book_detail_id = d.id JOIN book b ON d.book_id = b.id
                    WHERE b.author_id = ${author_id}
                        AND p.status = 1
                        AND b.id NOT IN (${top5})
                    GROUP BY y, m
                    HAVING y = ${year}
                `,
                 {type: sequelize.QueryTypes.SELECT}
            )

            result['sales'] = sales
        }

        const stats = await purchase.findAll({
            attributes: [
                [sequelize.literal("YEAR(purchase.created_date_time)"), "y"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {
                                author_id: author_id
                            },
                            attributes: [],
                        }
                    ]
                },
            ],
            group: [
                ["y"]
            ],
        });

        result['stats'] = stats

        if(books.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json(result);
        }

    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

/*router.get('/sales', isLoggedIn, isAuthor,async (req, res, next) => { //작가 입장에서 판 책들 가져오기
    var author_id = req.query.author_id;
    var period = parseInt(req.query.period);
    var period_cond;

    if(period === 0) {
        period_cond = moment().subtract('1', 'y').toDate()
    } else if(period === 1) {
        period_cond = moment().subtract('6', 'M').toDate()
    } else if(period === 2) {
        period_cond = moment().subtract('3', 'M').toDate()
    } else if(period === 3) {
        period_cond = moment().subtract('1', 'M').toDate()
    }

    try{
        const sales = await purchase.findAll({
            attributes: [
                [sequelize.literal("SUM(purchase.price)"), "revenue"],
                [sequelize.literal("(purchase.created_date_time)"), "date"],
            ],
            where: {
                status : 1,
                created_date_time: {
                    [Op.gte]: period_cond,
                },
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {author_id: author_id},
                            attributes: [],
                        }
                    ]
                },
            ],
            group: [
                [sequelize.literal("DATE_FORMAT(purchase.created_date_time, '%y%m%d')"), "date"]
            ],
            order : [
                ["created_date_time", "ASC"],
            ],
        });

        if(sales.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                sales : sales,
            });
        }

    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});*/

router.get('/sales/amount/author', isLoggedIn, isAuthor, async(req, res, next) => {
    var author_id = req.query.author_id;
    try {
        const amount = await account.findOne({
            attributes: [
                'total_earned_money',
                'total_withdrawal_amount',
                'amount_available_withdrawal',
                'request_withdrawal_amount',
            ],
            where: {
                author_id: author_id,
            },
        });

        if(!amount){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                amount : amount,
            });
        }
    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

router.get('/sales/author', isLoggedIn, isAuthor, async(req, res, next) => {
    var author_id = req.query.author_id;
    try {
        const sales = await purchase.findAll({
            attributes: [
                'id',
                'created_date_time',
                'price',
                [sequelize.literal("`book_detail->book`.charge"),"charge"],
                [sequelize.literal("member.nickname"), "buyer"],
            ],
            where: {
                status: 1,
            },
            include: [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {
                                author_id: author_id
                            },
                            attributes: [],
                        }
                    ]
                },
                {
                    model: member,
                    as : "member",
                    attributes: [],
                }
            ],
        });
        if(sales.length === 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                sales : sales,
            });
        }
    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
        res.status(StatusCodes.OK);

    }
    catch(err){
        logger.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
