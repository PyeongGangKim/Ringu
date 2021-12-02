'use strict';

const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");

const statusCodes = require("../../helper/statusCodes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");
const {checkNullAndUndefined} = require("../../helper/checkNullAndUndefined")
const { sequelize, category, favorite_book, book, book_detail, member, review, review_statistics, purchase, Sequelize: {Op} } = require("../../models");
const { dontKnowTypeStringOrNumber } = require("../../helper/typeCompare");
const {getImgURL} = require("../../utils/aws");
const {AWS_IMG_BUCKET_URL} = require("../../config/aws");

let router = express.Router();

router.get('/', async(req, res, next) => { // 커버만 가져오는 api, 검색할 때 도 사용 가능. picked로 md's pick list 가져오기
    try{
        let author_id = req.query.author_id;
        let keyword = req.query.keyword;
        let member_id = req.query.member_id;
        let categories = ("categories" in req.query && typeof req.query.categories !== undefined) ? req.query.categories.map(x => {return parseInt(x)}) : null;
        let order = ("order" in req.query && typeof req.query.order !== undefined) ? req.query.order : 'created_date_time';
        let orderBy = ("orderBy" in req.query && typeof req.query.orderBy !== undefined) ? req.query.orderBy : 'DESC';

        let is_approved = ("is_approved" in req.query && typeof req.query.is_approved !== 'undefined') ? req.query.is_approved : null;
        let is_picked = ("is_picked" in req.query && typeof req.query.is_picked !== 'undefined') ? req.query.is_picked : null;
        let is_recommending_phrase = ("is_recommending_phrase" in req.query && typeof req.query.is_recommending_phrase !== 'undefined') ? req.query.is_recommending_phrase : null;
        order = ("is_picked" in req.query && req.query.is_picked) ? "rank" : order;
        orderBy = ("is_picked" in req.query && req.query.is_picked) ? "ASC" : orderBy;

        let orderParams = [
            [sequelize.literal(order), orderBy]
        ]

        if ("order" in req.query && typeof req.query.order !== undefined && order !== 'create_date_time') {
            orderParams.push(['created_date_time', 'DESC'])
        }
        /* 소개도 키워드를 찾을 수 있게 하기.*/
        let where={
            status: 1,
        }
        if(!checkNullAndUndefined(author_id)) {
            where['author_id'] = author_id
        }
        if(!checkNullAndUndefined(categories)){
            where['category_id'] = categories
        }
        if(!checkNullAndUndefined(keyword)){
            let orClause = {
                '$book.title$' : {
                    [Op.like] :  "%"+keyword+"%",
                },
                '$author.nickname$' : {
                    [Op.like] :  "%"+keyword+"%",
                },
                '$author.nickname$' : {
                    [Op.like] :  "%"+keyword+"%",
                },
                '$book.description$' : {
                    [Op.like] :  "%"+keyword+"%",
                },
                '$book.recommending_phrase$': {
                    [Op.like] :  keyword,
                }
            }
            where[Op.or] = orClause;
        }
        if(!checkNullAndUndefined(is_approved)){
            where['is_approved'] = is_approved;
        }

        if(!checkNullAndUndefined(is_picked)) {
            where['is_picked'] = is_picked;
        }
        if(!checkNullAndUndefined(is_recommending_phrase)){
            where['is_recommending_phrase'] = is_recommending_phrase;
        }

        const bookList = await book.findAll({
            attributes: [
                "rank",
                "id",
                "price",
                "img",
                "title",
                "type",//type 1이 연재본, 2가 단행본.
                "is_finished_serialization",
                "is_approved",
                "created_date_time",
                "recommending_phrase",
                [sequelize.literal("COUNT(`book_details->purchases`.id)"), "sales"],
                [sequelize.literal("favorite_books.id"), "favorite_book_id"], // 없으면 null, 있으면 id 반환
                [sequelize.literal("SUM(`book_details->review_statistics`.score_amount) / SUM(`book_details->review_statistics`.person_number)"),"score" ],
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("category.name"), "category"],
            ],
            where: where,
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
                        },
                        {
                            model : purchase,
                            as : 'purchases',
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
            order: orderParams,
        });

        for(let i = 0 ; i < bookList.length ; i++){
            if(bookList[i].img == null || bookList[i].img[0] == 'h') continue;
            bookList[i].img = getImgURL(bookList[i].img);
        }
        if(bookList.length == 0){
            res.status(statusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(statusCodes.OK).json({
                bookList: bookList,
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
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
                ["id", "book_id"],
                ["title", "book_title"],
                "price",
                "img",
                [sequelize.literal("book_details.id"),"id"],
                [sequelize.literal("book_details.title"),"title"],
                "type",//type 1이 연재본, 2가 단행본.
                "serialization_day",
                "is_finished_serialization",
                ["description", "book_description"],
                "content",
                "preview",
                "recommending_phrase",
                //[sequelize.literal("favorite_books.id"), "favorite_book_id"], // 없으면 null, 있으면 id 반환
                [sequelize.literal("author.id"), "author_id"],
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("author.description"), "author_description"],
                [sequelize.literal("author.profile"), "author_profile"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book_details.page_number"),"page_count"],
                [sequelize.literal("book_details.file"),"file"],
                [sequelize.literal("SUM(`book_details->review_statistics`.score_amount)"),"review_score"],
                [sequelize.literal("SUM(`book_details->review_statistics`.person_number)"),"review_count"],
            ],
            include : [
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
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [],
                        }
                    ]
                }
            ],
            group: 'book_id',
        });

        if(book_detail_info.length == 0){
            res.status(statusCodes.NO_CONTENT).send("No content");;
        }
        else{
            book_detail_info.dataValues.is_favorite = false;

            if(!!member_id) {
                const favorite = await favorite_book.findOne({
                    where: {
                        book_id: book_id,
                        member_id: member_id,
                    }
                })
                if(!!favorite) {
                    book_detail_info.dataValues.is_favorite = true
                }
            }
            if(!!book_detail_info.dataValues.author_profile) {
                book_detail_info.dataValues.author_profile = getImgURL(book_detail_info.dataValues.author_profile);
            }
            if(!!book_detail_info.img) {
                book_detail_info.dataValues.img = getImgURL(book_detail_info.img);
            }

            res.status(statusCodes.OK).json({

                "book": book_detail_info,
            });
        }

    }
    catch(err){
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/detail/:bookId', async(req, res, next) => { //book_id로 원하는 book의 detail까지 join해서 가져오는 api
    let book_id = req.params.bookId;
    let member_id = 'member_id' in req.query && req.query.member_id !== null ? req.query.member_id : null;

    var where = {
        book_id: book_id,
        status: 1,
    }

    var include = [
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

    try{
        const detailList = await book_detail.findAll({ // data 형식이 공통되는 attributes는 그냥 가져오고, book_detail를 object로 review달려서 나올 수 있도록
            where : where,
            attributes : [
                "title",
                "file",
                "id",
                "round",
                [sequelize.literal("`book->author`.nickname"), "author"],
                [sequelize.literal("book.img"), "img"],
                [sequelize.literal("book.price"), "price"],
                [sequelize.literal("book.title"), "book_title"],
            ],
            include : include
        });

        const total = await book_detail.findOne({
            where : where,
            attributes : [
                [sequelize.fn('Count','id'), 'count'],
            ],
            include : include
        })

        for(var i = 0; i < detailList.length; i++){
            if(detailList[i].dataValues.img === null || detailList[i].dataValues.img[0] === 'h') continue;
            detailList[i].dataValues.img = getImgURL(detailList[i].dataValues.img);
        }

        if(detailList.length == 0){
            res.status(statusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(statusCodes.OK).json({
                "detailList": detailList,
                "total": total,
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});
router.post('/single' , isLoggedIn, isAuthor, uploadFile, async(req, res, next) => { // book 등록 단행본은 detail까지, 등록되고 연재본은 cover만 등록
    //book table 에 넣는 attribute
    /*
        단행본만 넣기
    */
    let price = req.body.price;
    let book_description = req.body.book_description;
    let title = req.body.title;
    let category_id = req.body.category_id;
    let type = req.body.type;

    let img = (typeof req.files.img !== 'undefined') ? req.files.img[0].key : null;

    let content = req.body.content;
    let preview = (typeof req.files.preview !== 'undefined') ? req.files.preview[0].key : null;
    let file = (req.files.file == null ) ? null : req.files.file[0].key;
    let page_number = req.body.page_number;

    let author_id = req.user.id;

    let is_finished_serialization = 1;
    //let serialization_day = req.body.serialization_day;


    //book detail table에 넣는 attribute

    const t = await sequelize.transaction();

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
            //serialization_day: serialization_day,
        },{
            transaction: t,
        });

        await book_detail.create({
            title: new_book.title,
            book_id : new_book.id,
            page_number : page_number,
            file : file,
        },{
            transaction: t,
        });
        await t.commit();
        res.status(statusCodes.CREATED).send("single_published_book created");
    }
    catch(err){
        console.error(err);
        await t.rollback();
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});
router.post('/series', isLoggedIn, isAuthor, uploadFile, async(req, res, next) => {

    let price = req.body.price;
    let content = req.body.content;
    let book_description = req.body.book_description;
    let author_id = req.user.id;
    let category_id = req.body.category_id;
    let book_detail_titles = [];
    let title = req.body.title;
    let type = req.body.type;
    let is_finished_serialization = 1;
    let serialization_day = req.body.serialization_day;
    let img = (typeof req.files.img !== 'undefined') ? req.files.img[0].key : null;
    let preview = (typeof req.files.file !== 'undefined') ? req.files.file[0].key : null;


    //book detail table에 넣는 attribute
    var files = [];
    for(var file of req.files.file){
        files.push(file.key);
    }

    try{
        book_detail_titles = book_detail_titles.split(',')
    } catch(e) {
        console.error(e)
    }

    const t = await sequelize.transaction();

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
        },{
            transaction: t,
        });
        for(var i = 0 ; i < book_detail_titles.length; i++){            
            await book_detail.create({
                title: book_detail_titles[i],
                book_id : new_book.id,
                file : files[i],
                round: i+1,
            },{
                transaction: t,
            });
        }
        await t.commit();
        res.status(statusCodes.CREATED).send("serialization book created");

    }
    catch(err){
        await t.rollback();
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
})
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
        res.status(statusCodes.OK).json({
            "message" : "OK",
        });
    }
    catch(err){
        console.error(err);
        await t.rollback();
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
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
        res.status(statusCodes.OK).json({
            "message" : "OK",
        });
    }
    catch(err){
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server_error",
        });
    }
})

router.post('/modify', isLoggedIn, isAuthor, uploadFile, async (req,res,next) => {
    try {
        var book_id = req.body.book_id;
        var book_detail_id = null;
        if ("book_detail_id" in req.body) {
            book_detail_id = req.body.book_detail_id;
        }

        var params = {
            "title": req.body.title,
            "price": req.body.price,
            "description": req.body.book_description,
        }

        if (typeof req.body.content !== 'undefined') {
            params['content'] = req.body.content;
        }

        if (typeof req.body.day !== 'undefined') {
            params['serialization_day'] = req.body.day;
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

        if(book_detail_id !== null) {
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
        }

        await t.commit();
        res.status(statusCodes.OK).json({
            "message" : "OK",
        });
    }
    catch(err){
        console.error(err);
        await t.rollback();
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
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
            },
            attributes : [
                "file",
                [sequelize.literal("book.preview"),"preview"],
            ],
            include : [
                {
                    model : book,
                    as : "book",
                    attributes: [],
                }
            ],
        });
        const url = downloadFile(type, result.dataValues[type]);

        res.status(statusCodes.OK).json({
            "url" : url,
        });
    }
    catch(err){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
        console.error(err);
    }
});

module.exports = router;
