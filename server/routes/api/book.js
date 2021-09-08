const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");

const { sequelize, category, favorite_book, book, book_detail, member, review, review_statistics, purchase, Sequelize: {Op} } = require("../../models");


router.get('/', async(req, res, next) => { // 커버만 가져오는 api, 검색할 때 도 사용 가능.
    try{
        let author_id = req.query.author_id;
        let category_id = req.query.category_id;
        let keyword = req.query.keyword;
        let member_id = req.query.member_id;
        let categories = ("categories" in req.query && typeof req.query.categories !== undefined) ? req.query.categories : [];
        categories = categories.map(x => {
            return parseInt(x)
        })
        let order = ("order" in req.query && typeof req.query.order !== undefined) ? req.query.order : 'created_date_time';
        let orderBy = ("orderBy" in req.query && typeof req.query.orderBy !== undefined) ? req.query.orderBy : 'DESC';
        let is_approved = ("is_approved" in req.query && req.query.is_approved) ? [0,1] : [1];

        const bookList = await book.findAll({
            attributes: [
                "id",
                "price",
                "img",
                "title",
                "type",//type 1이 연재본, 2가 단행본.
                "is_finished_serialization",
                "is_approved",
                "created_date_time",
                [sequelize.literal("favorite_books.id"), "favorite_book_id"], // 없으면 null, 있으면 id 반환
                [sequelize.literal("SUM(`book_details->review_statistics`.score_amount) / SUM(`book_details->review_statistics`.person_number)"),"score" ],
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("category.name"), "category"],
            ],
            where: {
                status: 1,
                is_approved : {
                    [Op.in] : is_approved
                },
                author_id : {
                    [Op.like] : (author_id == null || author_id == "") ? "%%" : author_id,
                },
                category_id : {
                    [Op.or]: categories,
                    //[Op.like] : (category_id == null || category_id == "") ? "%%" : category_id,
                },
                [Op.or]:{
                    //    [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    '$book.title$' : {
                        [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    },
                    '$author.nickname$' : {
                        [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    },
                },
            },
            include : [
                {
                    model : category,
                    as : 'category',
                    attributes : [],
                },
                {
                    model : member,
                    as : 'author',
                    attributes: [],
                },
                {
                    model : book_detail,
                    as : 'book_details',
                    attributes: [],
                    include : [
                        {
                            model : review_statistics,
                            as : 'review_statistics',
                            attributes: [],
                        }
                    ]
                },
                {
                    model : favorite_book,
                    as: 'favorite_books',
                    attributes: [],
                    required: false,
                    where: {
                        member_id : (member_id == null || member_id == "") ? null: member_id,
                    }
                }
            ],
            group: 'id',
            order: [
                [sequelize.literal(order), orderBy]
            ]

        });

        for(let i = 0 ; i < bookList.length ; i++){
            if(bookList[i].img == null || bookList[i].img[0] == 'h') continue;
            bookList[i].img = await imageLoad(bookList[i].img);
        }
        res.status(StatusCodes.OK).json({
            bookList: bookList,
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/main', async(req, res, next) => { // 커버만 가져오는 api, 검색할 때 도 사용 가능.
    let member_id = req.query.member_id;
    let is_approved = (req.query.is_approved) ? [req.query.is_approved] : [0,1];
    try{
        const bookList = await book.findAll({
            order: [sequelize.random()],
            attributes: [
                "id",
                "price",
                "img",
                "title",
                "type",//type 1이 연재본, 2가 단행본.
                [sequelize.literal("favorite_books.id"), "favorite_book_id"], // 없으면 null, 있으면 id 반환
                [sequelize.literal("SUM(`book_details->review_statistics`.score_amount) / SUM(`book_details->review_statistics`.person_number)"),"mean_score" ],
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("category.name"), "category"],
            ],
            where: {
                status: 1,
                is_approved : {
                    [Op.in] : is_approved
                },
            },
            include : [
                {
                    model : category,
                    as : 'category',
                    attributes : [],
                },
                {
                    model : member,
                    as : 'author',
                    attributes: [],
                },
                {
                    model : book_detail,
                    as : 'book_details',
                    attributes: [],
                    include : [
                        {
                            model : review_statistics,
                            as : 'review_statistics',
                            attributes: [],
                        }
                    ]
                },
                {
                    model : favorite_book,
                    as: 'favorite_books',
                    attributes: [],
                    required: false,
                    where: {
                        member_id : (member_id == null || member_id == "") ? null : member_id,
                    }
                }
            ],
            group: 'id',
        });
        if(bookList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            for(let i = 0 ; i < bookList.length ; i++){
                if(bookList[i].dataValues.img == null || bookList[i].dataValues.img[0] == 'h') continue;
                bookList[i].dataValues.img = await imageLoad(bookList[i].dataValues.img);
            }
            res.status(StatusCodes.OK).json({
                bookList: bookList,
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

router.get('/:bookId', async(req, res, next) => { //book_id로 원하는 book의 detail까지 join해서 가져오는 api
    let book_id = req.params.bookId;
    let member_id = req.query.member_id; // 작가로 검색할때 사용 가능(?)

    try{
        const book_detail_info = await book.findOne({ // data 형식이 공통되는 attributes는 그냥 가져오고, book_detail를 object로 review달려서 나올 수 있도록
            where : {
                id: book_id,
            },
            attributes : [
                "id",
                "price",
                "img",
                "title",
                "type",//type 1이 연재본, 2가 단행본.
                "serialization_day",
                "is_finished_serialization",
                "description",
                "content",
                "preview",
                [sequelize.literal("favorite_books.id"), "favorite_book_id"], // 없으면 null, 있으면 id 반환
                [sequelize.literal("author.id"), "author_id"],
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("author.description"), "author_description"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book_details.page_number"),"page_count"],
                [sequelize.literal("book_details.file"),"file"],
                [sequelize.literal("SUM(`book_details->review_statistics`.score_amount)"),"review_score"],
                [sequelize.literal("SUM(`book_details->review_statistics`.person_number)"),"review_count"],
            ],
            include : [
                {
                    model : favorite_book,
                    as: 'favorite_books',
                    attributes: [],
                    required: false,
                    where: {
                        member_id : {
                            [Op.like] : (member_id == null || member_id == "") ? "%%" : member_id,
                        }
                    }
                },
                {
                    model : member,
                    as : "author",
                    attributes: [],
                },
                {
                    model : category,
                    as : "category",
                    attributes : [],
                },
                {
                    model : book_detail,
                    as : "book_details",
                    required: false,
                    attributes: [
                        "id",
                        "title",
                        "file",
                        "round",
                        "page_number",
                        "created_date_time",
                    ],
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required: false,
                            attributes: [
                                "created_date_time",
                                "description",
                                "score",
                            ],
                            include : [
                                {
                                    model: member,
                                    as : "member",
                                    attributes: [

                                        "nickname"
                                    ],
                                    required : false,
                                }
                            ]
                        },
                        {
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [],
                        }
                    ]
                }
            ],
        });
        if(book_detail_info.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            book_detail_info.img = await imageLoad(book_detail_info.img);
            res.status(StatusCodes.OK).json({
                "book": book_detail_info,
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

router.get('/detail/:bookId', async(req, res, next) => { //book_id로 원하는 book의 detail까지 join해서 가져오는 api
    let book_id = req.params.bookId;
    let member_id = 'member_id' in req.query && req.query.member_id !== null ? req.query.member_id : null;

    try{
        const detailList = await book_detail.findAll({ // data 형식이 공통되는 attributes는 그냥 가져오고, book_detail를 object로 review달려서 나올 수 있도록
            where : {
                book_id: book_id,
                status: 1,
            },
            attributes : [
                "title",
                "file",
                "id",
                [sequelize.literal("`book->author`.nickname"), "author"],
                [sequelize.literal("book.img"), "img"],
                [sequelize.literal("book.price"), "price"],
                [sequelize.literal("book.title"), "book_title"],
            ],

            include : [
                {
                    model: purchase,
                    as : "purchases",
                    required: false,
                    where: {
                        member_id: member_id,
                    }
                },
                {
                    model: book,
                    as: "book",
                    attributes: [],
                    include: [{
                        model:member,
                        as: "author",
                        attributes: [],
                    }]
                }
            ]
        });

        if(detailList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                "detailList": detailList,
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
router.post('/' , isLoggedIn, isAuthor, uploadFile, async(req, res, next) => { // book 등록 단행본은 detail까지, 등록되고 연재본은 cover만 등록
    //book table 에 넣는 attribute
    let price = req.body.price;
    let content = req.body.content;
    let book_description = req.body.book_description;
    let author_id = req.user.id;
    let category_id = req.body.category_id ? 1: 1;

    let title = req.body.title;
    let type = req.body.type;
    let is_finished_serialization = (type == 2) ? 1 : 0;
    let serialization_day = req.body.serialization_day;
    let img = req.files.img[0].key;
    let preview = (req.files.preview == null) ? null : req.files.preview[0].key;


    //book detail table에 넣는 attribute
    let page_number = req.body.page_number;
    let file = (req.files.file == null ) ? null : req.files.file[0].key;

    try{
        const new_book = await book.create({
            title: title,
            price: price,
            content: content,
            description: book_description,
            author_id : author_id,
            img : img,
            category_id : category_id,
            preview: preview,
            type: type,
            is_finished_serialization : is_finished_serialization,
            serialization_day: serialization_day,
        });
        console.log(new_book);
        if(new_book.type == 2){//단행본 일때,
            const new_single_book = await book_detail.create({
                title: new_book.title,
                book_id : new_book.id,
                page_number : page_number,
                file : file,
            });
            console.log(new_single_book);
            res.status(StatusCodes.CREATED).send("single_published_book created");
        }
        else{
            res.status(StatusCodes.CREATED).send("serialization_book_cover created");
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.post('/serialization', isLoggedIn, isAuthor, uploadFile, async(req, res, next) => {
    let page_number = req.body.page_number;
    let file = req.files.file[0].key;
    let book_id = req.body.book_id;
    let title = req.body.title;
    let round = req.body.round;
    try{
        const new_round_book = await book_detail.create({
            title: title,
            book_id : book_id,
            page_number : page_number,
            file : file,
            round: round
        });
        console.log(new_round_book);
        res.status(StatusCodes.CREATED).send("new round serialization_book created");
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.delete('/:bookId', isLoggedIn, async(req, res, next) => {
    const bookId = req.params.bookId;
    const t = await sequelize.transaction();
    try{
        const delete_book_details = await book_detail.findAll({
            where : {
                book_id : bookId,
            }
        });
        for(let delete_book_detail of delete_book_details){
            await book_detail.update({
                status : 0
            },{
                where : {
                    id : delete_book_detail.id
                },
                transaction: t
            });
        }
        await book.update({
            status: 0,
        },{
            where : {
                id : bookId,
            },
            transaction: t
        });
        await t.commit();
        res.status(StatusCodes.OK).json({
            "message" : "OK",
        });
    }
    catch(err){
        console.error(err);
        await t.rollback();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server_error",
        });
    }
})
router.delete('/round/:bookDetailId', isLoggedIn, async(req, res, next) => {
    const bookDetailId = req.params.bookDetailId;
    try{
        const result = await book_detail.update({
            status: 0,
        },{
            where: {
                id: bookDetailId,
            }
        });
        res.status(StatusCodes.OK).json({
            "message" : "OK",
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server_error",
        });
    }
})

router.post('/modify', isLoggedIn, isAuthor, uploadFile, async (req,res,next) => {
    try {
        let book_id = req.body.book_id;
        let book_detail_id = req.body.book_detail_id;

        console.log(req.body)

        var params = {
            "title": req.body.title,
            "price": req.body.price,
            "description": req.body.book_description,
            "content": req.body.content,
        }



        if (typeof req.files.img !== 'undefined') {
            params['img'] = req.files.img[0].key;
        }

        if (typeof req.files.preview !== 'undefined') {
            params['preview'] = req.files.preview[0].key;
        }


        const t = await sequelize.transaction();

        const updateBook = await book.update(
            params,
        {
            where: {
                id: book_id
            },
            transaction: t
        })

        params = {
            "page_number": req.body.page_count,
        }

        if (typeof req.files.file !== 'undefined') {
            params['file'] = req.files.file[0].key;
        }

        const updateBookDetail = await book_detail.update(
            params,
        {
            where: {
                id: book_detail_id
            },
            transaction: t
        })

        await t.commit();
        res.status(StatusCodes.OK).json({
            "message" : "OK",
        });
    }
    catch(err){
        console.error(err);
        await t.rollback();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
})

router.get('/download/:bookDetailId', isLoggedIn, async (req,res,next) => {
    const bookDetailId = req.params.bookDetailId;
    const type = req.query.type;
    try{
        const result = await book_detail.findOne({
            where : {
                id : bookDetailId,
            }
        });
        const url = downloadFile(type, result.file);

        res.status(StatusCodes.OK).json({
            "url" : url,
        });
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
        console.error(err);
    }
});

module.exports = router;
