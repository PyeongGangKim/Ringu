var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");
var helper_date = require("../../helper/date");
const { checkLogin } = require("../../helper/activity");

const { uploadFile, deleteFile, downloadFile } = require("../../middlewares/third_party/aws");

const { book, category, member, book_detail, Sequelize : { Op }, sequelize } = require("../../models/index");


router.get("/serialization/cover", async (req, res, next) => {//연재본, 단행본 둘다 불러올 때는 해당 api사용.
    
    checkLogin(req, res, "/admin/book/serialization/" );

    let sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "title"         : ("title" in req.query) ? req.query.title : "",
        "price"         : ("price" in req.query) ? req.query.price : "",
        "is_approved"   : ("is_approved" in req.query) ? req.query.is_approved : "",
        "category_name" : ("category_name" in req.query) ? req.query.category_name : "",
        "member_name"   : ("member_name" in req.query) ? req.query.member_name : "",
    }

    try{
        const {count, rows} = await book.findAndCountAll({
            where: {
                [Op.and] : {
                    type: 1,
                    price : (fields.price != "") ?{[Op.lte] : fields.price} : {[Op.gte] : 0},
                    '$category.name$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.category_name+"%" } : {[Op.like] : "%%" } ,
                    title : (fields.title != "") ? { [Op.like]: "%"+fields.title+"%" } : {[Op.like] : "%%" } ,
                    '$author.nickname$' : (fields.title != "") ? { [Op.like]: "%"+fields.member_name+"%"} : {[Op.like] : "%%"},
                },
                status : 1,
            },
            limit : limit,
            offset : offset,
            order : [
                [sort_by, sort_direction],
            ],
            include : [
                {
                    model : category,
                    as : "category",
                    attributes: ['name'],
                },
                {
                    model : member,
                    as : "author",
                    attributes: ['nickname'],
                },
            ]
        });
        console.log(rows);
        var total_count = count;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/book/serialization", page, limit, total_count, fields);
        res.render("admin/pages/serialization_cover_list" , {
            "fields"      : fields,
            "book_list"       : rows,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "limit"             : limit,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.get("/serialization/:serializationId", async(req, res, next) => {//cover 하나만 가져오기
    checkLogin(req, res, "/admin/book/serialization");

    let id = req.params.serializationId;

    try{
        const findedBook = await book.findOne({
            where: {
                id : id
            },
            include : [
                {
                    model: member,
                    as: 'author',
                    attributes : ['nickname'],
                },
                {
                    model: category,
                    as: 'category',
                    attributes : ['name'],
                }
            ]
        });
        res.render("admin/pages/serialization_cover_view", {
                "book"                  : findedBook,
                "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.log(err);
    }

});

router.get("/serialization/content/list", async(req, res, next) => {//content 모두 가져오기
    checkLogin(req, res, "/admin/book/serialization/");

    let serialization_book_id = req.query.serialization_book_id;
    let limit           = 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);
    try{
        console.log(serialization_book_id);
        const {count, rows} = await book_detail.findAndCountAll({
            where : {
                book_id : serialization_book_id,
                status: 1,
            },
            limit : limit,
            offset : offset,
            order : [
                ['round' ,'DESC']
            ],

        });
        const cover = await book.findOne({
            where: {
                id: serialization_book_id,
            },
            include : [
                {
                    model: member,
                    as: "author",
                    attributes: ['nickname'],
                },
                {
                    model: category,
                    as: "category",
                    attributes: ['name'],
                },
            ]
        });
        console.log(rows, cover);
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/book/serialization/content/list", page, limit, count, serialization_book_id);
        res.render("admin/pages/serialization_content_list", {
            "total_count"       : count,
            "pagination_html"   : pagination_html,
            "contents"               : rows,
            "cover"                 : cover,
            "helper_date"           : helper_date,
    });
    }
    catch(err){
        console.error(err);
    }    
});
router.get("/serialization/content/:bookId", async (req, res, next) => {//content 하나만 가져오기
    
    checkLogin(req, res, "/admin/book/serialization/content");
    

    let id = req.params.bookId;

    try{
        const findedBook = await book_detail.findOne({
            where: {
                id : id,
            }
        });
        res.render("admin/pages/serialization_content_view", {
                "book"                  : findedBook,
                "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.log(err);
    }

});

router.get("/serialization/cover/info/create/", (req, res, next) => {
    
    res.render("admin/pages/serialization_cover_create");
});

router.post("/serialization/cover", uploadFile, async (req, res, next) => {//생성하는 페이지가 다르니 굳이 붙여서 할 필요는 없을 듯, 연재본 페이지
    checkLogin(req, res, "/admin/book/serialization/");
    
    let title = req.body.title;
    let serialization_day = req.body.serialization_day;
    let price = req.body.price;
    let member_id = req.body.member_id;
    let description = req.body.description; 
    let img = req.files.img[0].key;
    let category_name = req.body.category_name;
    let content = req.body.content;
    try{
        const bookCategory = await category.findOne({
            where: {
                name : category_name,
            }
        });
        const serializationCover = await book.create({
            title : title,
            price : price,
            serialization_day : serialization_day,
            description : description,
            author_id : member_id,
            img : img,
            category_id : bookCategory.id,
            content : content,
            is_finished_serialization: 1,
            type: 1,
        });
        const result = await book.findOne({
            where: {
                id : serializationCover.id,
            },
            include : [
                {
                    model : member,
                    as : "author",
                    attributes: ['nickname'],
                },
                {
                    model : category,
                    as : "category",
                    attributes: ['name'],
                }
            ]
        })
        res.render("admin/pages/serialization_cover_view",{
            "book"                  : result,
            "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.get("/serialization/content/info/create/", (req, res, next) => {
    
    res.render("admin/pages/serialization_content_create",{
        "serialization_book_id" : req.query.id,
    });
});

router.post("/serialization/content", uploadFile, async (req, res, next) => {
    checkLogin(req, res, "/admin/book/serialization/");
    
    let serialization_book_id = req.body.book_id;
    let round = req.body.round;
    let page_number = req.body.page_number;
    let file = req.files.file[0].key;
    let title = req.body.title;
    try{
        const result = await book_detail.create({
            book_id : serialization_book_id,
            file : file,
            title : title,
            round : round,
            page_number: page_number,
        });
        if(round == 1){
            await book.update({
                preview: file,
            },{
                where: {
                    id: book_id,
                }
            });
        }
        res.render("admin/pages/serialization_content_view",{
            "book"                  : result,
            "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.get("/singlePublished", async (req, res, next) => {//단행본 가져오기

    checkLogin(req, res, "/admin/book/singlePublished/");
    

    let sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "title"         : ("title" in req.query) ? req.query.title : "",
        "price"         : ("price" in req.query) ? req.query.price : "",
        "is_approved"   : ("is_approved" in req.query) ? req.query.is_approved : "",
        "category_name"   : ("category_name" in req.query) ? req.query.category_name : "",
        "member_name"   : ("member_name" in req.query) ? req.query.member_name : "",
    }

    try{
        const {count, rows} = await book.findAndCountAll({
            /*raw: true,
            attributes: [
                "id",
                "price",
                "title",
                "content",
                "description",
                [sequelize.literal("author.nickname"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book_details.is_approved"), "is_approved"],
                [sequelize.literal("book_details.id"), "book_details_id"],
            ],*/
            where: {
                [Op.and] : {
                    type: 2,
                    price : (fields.price != "") ?{[Op.lte] : fields.price} : {[Op.gte] : 0},
                    '$category.name$' : {
                        [Op.like ] : (fields.category_name != "") ? ("%"+fields.category_name+"%")  : ("%%")
                    },
                    title : {
                        [Op.like] : (fields.title != "") ? ("%"+fields.title+"%") : ("%%")
                    },
                    '$author.nickname$' : {
                        [Op.like] : (fields.title != "") ? ("%"+fields.member_name+"%") : ("%%")
                    }
                },
                status : 1,
            },
            limit : limit,
            offset : offset,
            order : [
                [sort_by, sort_direction],
            ],
            include : [
                {
                    model : category,
                    as : "category",
                    attributes: ['name'],
                    required: true,
                },
                {
                    model : member,
                    as : "author",
                    attributes: ['nickname'],
                    required: true,
                },
                {
                    model: book_detail,
                    as : "book_details",
                    //attribute: ['is_approved', 'id',],
                    required: true,
                }
            ]
        });
        for(let i = 0 ; i < rows.length ; i++){
            console.log(rows[i].book_details);
        }
        var total_count = count;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/book/singlePublished", page, limit, total_count, fields);
        res.render("admin/pages/single_published_book_list", {
            "fields"      : fields,
            "book_list"       : rows,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "limit"             : limit,
        });
    }
    catch(err){
        console.log(err);
    }
});
router.get("/singlePublished/:singlePublished", async (req, res, next) => {
    checkLogin(req, res, "/admin/book/singlePublished");
    

    let id = req.params.singlePublished;

    try{
        const findedBook = await book.findOne({
            attributes: [
                "id",
                "price",
                "title",
                "content",
                "description",
                [sequelize.literal("author.nickname"), "author"],
                [sequelize.literal("category.name"), "category"],
                [sequelize.literal("book_details.page_number"), "page_number"],
                [sequelize.literal("book_details.is_approved"), "is_approved"],
                [sequelize.literal("book_details.id"), "book_details_id"],
            ],
            raw: true,
            where: {
                id : id,
            },
            include: [
                {
                    model: member,
                    as : "author",
                    attributes : ['nickname'],
                },
                {
                    model : category,
                    as : "category",
                    attributes : ['name'],
                },
                {
                    model : book_detail,
                    as : "book_details",
                }
            ]
        });
        console.log(findedBook);
        res.render("admin/pages/single_published_book_view", {
                "book"                  : findedBook,
                "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.log(err);
    }
});
router.get("/singlePublished/info/create/", (req, res, next) => {
    
    res.render("admin/pages/single_published_book_create");
});

router.post("/singlePublished", uploadFile, async (req, res, next) => {
    checkLogin(req, res, "/admin/book/singlePublished/");
    
    let price = req.body.price;
    let content = req.body.content;
    let page_number = req.body.page_number;
    let description = req.body.description;
    let author_id = req.body.author_id;
    let file = req.files.file[0].key;
    let img = req.files.img[0].key;
    let preview = req.files.preview[0].key;
    let category_name = req.body.category_name;
    let title = req.body.title;
    try{
        const bookCategory = await category.findOne({
            where: {
                name : category_name,
            }
        });
        const singlePublished = await book.create({
            price : price,
            content : content,
            page_number : page_number,
            description : description,
            author_id : author_id,
            img : img,
            category_id : bookCategory.id,
            preview : preview,
        });
        await book.create({
            file : file,
            title : title,
            single_published_book_id : singlePublished.id,
            type: 2,
        });
        const result = await single_published_book.findOne({
            where: {
                id : singlePublished.id,
            },
            include: [
                {
                    model: book,
                    as : "book",
                },
                {
                    model: category,
                    as : "category",
                    attributes: ['name'],
                },
                {
                    model: member,
                    as : "author",
                    attributes: ['nickname'],
                }
            ]
        })
        res.render("admin/pages/single_published_book_view",{
            "book"                  : result,
            "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.log(err);
    }
});


router.get("/delete/:bookId", async (req, res, next) => {

    checkLogin(req, res, "/admin/book/");
   

    let idx = req.params.bookId;
    try{
        await book.update({
            status : 0
        },{
            where: {
                id : idx
            }
        });
        res.redirect("/admin/book/");
    }
    catch(err){
        console.log(err);
    }
});
router.get("/finishedSerializing/:serializationId", async (req, res, next) => {
    
    checkLogin(req, res, "/admin/member/");
   
    
    let id = req.params.serializationId;
    try{
        await serialization_book.update({
            is_finished_serialization: 1,
        },{
            where: {
                id: id,
            }
        });
    }
    catch(err){
        console.error(err);
    }
});

router.get("/approved/:bookDetailId", async (req,res,next) => {

    checkLogin(req, res, "/admin/member/");


    let id = req.params.bookDetailId;
    console.log(id);
    try{
        await book_detail.update({
            is_approved : 1
        },{
            where: {
                id : id
            } 
        });
        res.redirect("/admin/member/");
    }
    catch(err){
        console.log(err);
    }
});

router.get('/download/:bookDetailId', async (req,res,next) => {
    checkLogin(req, res, "/admin/book/");
    
    
    const book_detail_id = req.params.bookDetailId;
    const type = req.query.type;
    try{
        const result = await book_detail.findOne({
            where : {
                id : book_detail_id,
            }
        });
        const url = downloadFile(type, result.file);
        console.log(url);
        res.redirect(url);

    }
    catch(err){ 
        console.error(err);
    }
});


module.exports = router;
