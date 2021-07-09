const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");

const { sequelize, category, favorite_book, book, book_detail, member, review, review_statistics, Sequelize: {Op} } = require("../../models");


router.get('/', async(req, res, next) => { // 커버만 가져오는 api, 검색할 때 도 사용 가능.
    let author_id = req.query.author_id;
    let category_id = req.query.category_id;
    let keyword = req.query.keyword;
    let member_id = req.query.member_id;

    try{
        const bookList = await book.findAll({
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
                author_id : {
                    [Op.like] : (author_id == null || author_id == "") ? "%%" : author_id,
                },
                category_id : {
                    [Op.like] : (category_id == null || category_id == "") ? "%%" : category_id,
                },
                [Op.or]:{
                    '$category.name$' : {
                        [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    },
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
                        member_id : {
                            [Op.like] : (member_id == null || member_id == "") ? "%%" : member_id,
                        }
                    }
                }
            ],
            group: 'id',
        });
        if(bookList.length == 0){
            console.log(bookList);
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            for(let i = 0 ; i < bookList.length ; i++){
                console.log(bookList[i].dataValues.img);
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
                [sequelize.literal("`book_details->review_statistics`.score_amount"),"review_score"],
                [sequelize.literal("`book_details->review_statistics`.person_number"),"review_count"],
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
            console.log(book_detail);
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            book_detail_info.dataValues.img = await imageLoad(book_detail_info.dataValues.img);
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
    let book_detail_id = req.params.bookId;

    try{
        const book_detail_info = await book_detail.findOne({ // data 형식이 공통되는 attributes는 그냥 가져오고, book_detail를 object로 review달려서 나올 수 있도록
            where : {
                id: book_detail_id,
            },
            attributes : [
                "id",
                [sequelize.literal("book_detail.title"),"subtitle"],
                [sequelize.literal("`book->author`.nickname"),"author"],
                [sequelize.literal("book.price"),"price"],
                [sequelize.literal("book.type"),"type"],
                [sequelize.literal("book.title"),"title"],
            ],

            include : [
                {
                    model : book,
                    as : "book",
                    attributes: [
                        "title",
                        "price",
                        "type",

                    ],
                    include: [
                        {
                            model : member,
                            as : "author",
                            attributes: [
                                "nickname",
                            ],
                        },
                        {
                            model : category,
                            as : "category",
                            attributes : [

                            ],
                        },
                    ]
                },
            ],
        });

        if(book_detail_info.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
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
router.post('/' , isLoggedIn, isAuthor, uploadFile, async(req, res, next) => { // book 등록 단행본은 detail까지, 등록되고 연재본은 cover만 등록
    //book table 에 넣는 attribute
    let price = req.body.price;
    let content = req.body.content;
    let book_description = req.body.book_description;
    let author_id = req.body.author_id;
    let category_id = req.body.category_id;
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
            book_description: book_description,
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
    let file = req.files.file[0].location;
    let book_id = req.body.book_id;
    let title = req.body.title;
    let round = req.body.round;
    try{
        const new_round_book = book_detail.create({
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

router.get('/download/:bookDetailId', isLoggedIn, async (req,res,next) => {
    const bookDetailId = req.params.bookDetailId;
    const type = req.query.type;
    try{
        const result = await book_detail.findOne({
            where : {
                id : bookDetailId,
            }
        });
        console.log(type);
        const url = downloadFile(type, result.file);
        console.log(result.file);

        res.status(StatusCodes.OK).json({
            "url" : url,
        });
    }
    catch(err){
        console.error(err);
    }
});

module.exports = router;
