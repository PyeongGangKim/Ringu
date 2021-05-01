const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");
var router = express.Router();

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile } = require("../../middlewares/third_party/aws");
 
const {purchase ,author ,sequelize,category, book, single_published_book, serialization_book, member, review, Sequelize: {Op} } = require("../../models");


router.get('/', async(req, res, next) => {
    let author_id = req.query.author_id;
    let category_id = req.query.category_id;
    let keyword = req.query.keyword;
    try{
        const singlePublishedBook = await single_published_book.findAll({
            attributes : [
                "id",
                "price",
                "img",
                "author_id",
                "preview",
                [sequelize.literal("sum( `book->reviews`.score) / count(`book->reviews`.id)"),"review_score"],            
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book.title"),"title"],
                [sequelize.literal("book.type"),"type"],
                [sequelize.literal("book.id"),"book_id"],
            ],
            where: {
                status: 1,
                '$book.is_approved$' : 1,
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
                    '$author.name$' : {
                        [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    },
                }

            },
            include : [
                {
                    model : author,
                    as : "author",
                    attributes: [],
                },
                {
                    model : category,
                    as : "category",
                    attributes : [],
                },
                {
                    model : book,
                    as : "book",
                    where: {is_approved : 1, status: 1},
                    attributes:[],
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required : false,
                            attributes: [],
                        }
                    ]
                }
            ],
            group: ["book.id"],
        });
        
        const serializationBook = await serialization_book.findAll({
            attributes: [
                "id",
                "title", 
                "price",
                "img",
                "author_id",
                [sequelize.literal("sum( `books->reviews`.score) / count(books.id)"),"review_score"],
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("books.type"),"type"],
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
                    title : {
                        [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    },
                    '$author.name$' : {
                        [Op.like] :  (keyword == null || keyword == "") ? "%%"  :  "%"+keyword+"%",
                    },
                }
            },
            include : [
                {
                    model : author,
                    as : "author",
                    attributes: [],
                },
                {
                    model : category,
                    as : "category",
                    attributes : [],
                },
                {
                    model : book,
                    as : "books",
                    attributes: [], 
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required : false,
                            attributes: [],
                        },
                    ],
                    
                },
            ],
            group: ["serialization_book.id"],
        });
        res.json({
            status: "ok", singlePublishedBook, serializationBook
        });
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "get all serialization book error",
        });
        console.error(err);
    }
});
router.get('/serialization', async(req, res, next) =>{
    try{
        const serializationBook = await serialization_book.findAll({
            attributes: [
                "id",
                "title", 
                "price",
                "img",
                "author_id",
                "serialization_day",
                "book_description",
                "author_description",
                "is_finished_serialization",
                [sequelize.literal("sum( `books->reviews`.score) / count(books.id)"),"review_score"],
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
            ],
            where: {
                status: 1,
            },
            include : [
                {
                    model : author,
                    as : "author",
                    attributes: [],
                },
                {
                    model : category,
                    as : "category",
                    attributes : [],
                },
                {
                    model : book,
                    as : "books",
                    attributes: [], 
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required : false,
                            attributes: [],
                        },
                    ],
                    
                },
            ],
            group: ["serialization_book.id"],
        });
        
        res.json({status: "ok", serializationBook});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "get all serialization book error",
        });
        console.error(err);
    }
    
});
router.get('/serialization/contents/:serializationId', async(req, res, next) => {
    let serializationId = req.params.serializationId;
    try{
        const contents = await serialization_book.findAll({
            attributes: [
                "id",
                "title", 
                "price",
                "img",
                "author_id",
                [sequelize.literal("sum( `books->reviews`.score) / count(`books->reviews`.id)"),"review_score"],
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("books.title"),"content_title"],
                [sequelize.literal("books.created_date_time"),"created_date_time"],
                [sequelize.literal("book.id"),"book_id"],
            ],
            where: {
                status: 1,
            },
            include : [
                {
                    model : author,
                    as : "author",
                    attributes: [],
                },
                {
                    model : category,
                    as : "category",
                    attributes : [],
                },
                {
                    model : book,
                    as : "books",
                    where : {
                        serialization_book_id: serializationId,
                        status: 1,
                    },
                    order: [
                        ["books.created_date_time", "ASC"]
                    ],
                    attributes: [], 
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required : false,
                            attributes: [],
                        },
                    ],
                },
            ],
            group: ["books.id"],
            
        });
        res.json({status: "ok", contents});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "get serialziation book contents error",
        });
        console.error(err);
    }
});
router.get('/serialization/cover/:serializationId', async(req, res, next) => {
    let serializationId = req.params.serializationId;
    try{
        const cover = await serialization_book.findOne({
            attributes : [
                "id",
                "title", 
                "price",
                "img",
                "serialization_day",
                "book_description",
                "author_description",
                "author_id",
                [sequelize.literal("sum( `books->reviews`.score) / count(books.id)"),"review_score"],
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
            ],
            where:{
                id : serializationId,
                status : 1,
            },
            include : [
                {
                    model : author,
                    as : "author",
                    attributes: []
                },
                {
                    model : category,
                    as : "category",
                    attributes : []
                },
                {
                    model : book,
                    as : "books",
                    attributes: [], 
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required : false,
                            attributes: [],
                        },
                    ],
                    
                },
            ],
            group: ["serialization_book.id"],
        });
        res.json({status: "ok", cover});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "get serialziation book cover error",
        });
        console.error(err);
    }
})

router.post('/serialization/cover', isLoggedIn, isAuthor, uploadFile, async(req, res, next) => {
    let title = req.body.title;
    let serialization_day = req.body.serialization_day;
    let price = req.body.price;
    let author_id = req.body.author_id;
    let author_description = req.body.author_description;
    let book_description = req.body.book_description; 
    let img = req.files.img[0].location;
    let category_id = req.body.category_id;
    try{
        await serialization_book.create({
            title: title,
            serialization_day : serialization_day,
            price: price,
            author_id: author_id,
            author_description: author_description,
            book_description: book_description,
            img: img,
            category_id: category_id, 
        });
        res.json({
            status: "ok",
        });
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "create serialization book cover error",
        });
        console.error(err);
    }
});

router.post('/serialization/content', isLoggedIn, isAuthor, uploadFile, async(req, res, next) => {
    let serialization_book_id = req.body.serialization_book_id;
    let file = req.files.file[0].location;
    let title = req.body.title;
    try{
        await book.create({
            serialization_book_id : serialization_book_id,
            file : file,
            title : title,
            type : 1,
        });
        res.json({
            status: "ok",
        })
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "create serialization book content error",
        });
        console.error(err);
    }
});
router.get('/singlePublished', async(req, res, next) => {
    try{
        const result = await single_published_book.findAll({
            attributes: [
                "id",
                "price",
                "img",
                "book_id",
                "author_id",
                "preview",
                [sequelize.literal("sum( `book->reviews`.score) / count(`book->reviews`.id)"),"review_score"],            
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book.title"),"title"],
            ],
            where: {
                status: 1,
            },
            include: [
                {
                    model : author,
                    as : "author",
                    attributes: [],
                },
                {
                    model : book,
                    as : "book",
                    attributes: [],
                    include: [
                        {
                            model: review,
                            as : "reviews",
                            attributes: [],
                        }
                    ]
                },
                {
                    model : category,
                    as : "category",
                    attributes : []
                }
            ],
            group: ['book.id'],
        });
        res.json({status: "ok", result});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "get all single published book error",
        });
        console.error(err);
    }
});
router.get('/singlePublished/:singlePublishedId', async (req,res,next) => {
    let singlePublishedId = req.params.singlePublishedId;
    try{
        const singlePublishedBook = await single_published_book.findOne({
            attributes : [
                "id",
                "price",
                "img",
                "author_id",
                "book_description",
                "author_description",
                "preview",
                [sequelize.literal("sum(`book->reviews`.score) / count(`book->reviews`.id)"),"review_score"],            
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book.title"),"title"],
                [sequelize.literal("book.id"),"book_id"],
            ],
            where : {
                id : singlePublishedId,
                '$book.is_approved$' : 1,
            },
            include : [
                {
                    model : author,
                    as : "author",
                    attributes: []
                },
                {
                    model : book,
                    as : "book",
                    attrigbutes : [],
                    include : {
                        model: review,
                        as : "reviews",
                        attributes: [],
                    },
                },
                {
                    model : category,
                    as : "category",
                    attributes : []
                }
            ]
        });
        res.json({
            status: "ok",
            singlePublishedBook,
        });
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "get single published book content error",
        });
        console.error(err);
    }
});

router.post('/singlePublished', isLoggedIn, isAuthor, uploadFile, async(req,res, next) => {
    let price = req.body.price;
    let content = req.body.content;
    let page_number = req.body.page_number;
    let author_description = req.body.author_description;
    let book_description = req.body.book_description;
    let author_id = req.body.author_id;
    let img = req.files.img[0].location;
    let category_id = req.body.category_id;
    let file = req.files.file[0].location;
    let title = req.body.title;
    let preview = req.files.preview[0].location;
    try{
        const singlePublished = await single_published_book.create({
            price : price,
            content : content,
            page_number : page_number,
            author_description : author_description,
            book_description : book_description,
            author_id : author_id,
            img : img,
            preview: preview,
            category_id : category_id,
        });
        await book.create({
            file : file,
            title : title,
            single_published_book_id : singlePublished.id,
            type: 2,
        });
        res.json({
            status: "ok",
        });
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "create single published book error",
        });
        console.error(err);
    }

});

router.get('/download/:bookId', isLoggedIn, async (req,res,next) => {
    const bookId = req.params.bookId;
    try{
        /*const checkPurchase = await purchase.findOne({
            where : {
                book_id : bookId,
                member_id : req.user.id,
            }
        });
        if(checkPurchase == null){
            res.json({
                status: "err",
                reason: "you have to purchase this book",
            });
            return ;
        }*/
        const result = await book.findOne({
            where : {
                id : bookId,
            }
        });
        const fileUrl = result.file.split('/');
        const fileUrlLength = fileUrl.length;
        const fileName = fileUrl[fileUrlLength - 1];
        const url = downloadFile(fileName);
        
        res.json({status: "ok", url});
    }
    catch(err){
        console.error(err);
    }
});

module.exports = router;
