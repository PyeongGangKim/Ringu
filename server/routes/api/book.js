const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile } = require("../../middlewares/third_party/aws");

const { author ,sequelize,category, book, book_detail, member, review, Sequelize: {Op} } = require("../../models");


router.get('/', async(req, res, next) => { // 커버만 가져오는 api, 검색할 때 도 사용 가능.
    let author_id = req.query.author_id;
    let category_id = req.query.category_id;
    let keyword = req.query.keyword;
    try{
        const book_cover_list = await book.findAll({
            attributes: [
                "id",
                "price",
                "img",
                "title",
                "type",//type 1이 연재본, 2가 단행본.
                //[sequelize.literal("")] 리뷰 평균 가져오기.
                [sequelize.literal("author.name"), "author"],
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
                    '$author.name$' : {
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
                    model : author,
                    as : 'author',
                    attributes: [],
                },
            ],
            
        });
        if(book_cover_list.length == 0){
            console.log(book_cover_list);
            res.status(StatusCodes.NO_CONTENT);
        }
        else{
            res.status(StatusCodes.OK).json({
                "book_cover_list": book_cover_list,
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
router.get('/:bookId', async(req, res, next) => { //book_id로 원하는 book의 detail까지 join해서 가져오는 api
    let book_id = req.params.bookId;
    try{
        const book_detail_info = await book.findAll({
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
                "book_description",
                "content",
                "preview",
                //[sequelize.literal("")] 리뷰 평균 가져오기.
                [sequelize.literal("author.name"), "author"],
                [sequelize.literal("category.name"), "category"],
            ],
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
                    model : book_detail,
                    as : "book_details",
                    required: false,
                    include : [
                        {
                            model: review,
                            as : "reviews",
                            required: false,
                        }
                    ]
                }
            ],
        });
        if(book_detail_info.length == 0){
            console.log(book_detail);
            res.status(StatusCodes.NO_CONTENT);
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
    console.log(serialization_day);
    let img = req.files.img[0].location;
    let preview = (req.files.preview == null) ? null : req.files.preview[0].location; 

    //book detail table에 넣는 attribute
    let page_number = req.body.page_number;
    let file = (req.files.file == null ) ? null : req.files.file[0].location;

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

    try{
        const new_round_book = book_detail.create({
            title: title,
            book_id : book_id,
            page_number : page_number,
            file : file,
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
