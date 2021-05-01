var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");
var helper_date = require("../../helper/date");
const { checkLogin } = require("../../helper/activity");

const { uploadFile, deleteFile, downloadFile } = require("../../middlewares/third_party/aws");

const { book, category, member, serialization_book, single_published_book, Sequelize : { Op } } = require("../../models/index");


router.get("/serialization", async (req, res, next) => {//cover들 모두 가져오기.

    checkLogin(req, res, "/admin/book/serialization/");
    

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
        const {count, rows} = await serialization_book.findAndCountAll({
            where: {
                [Op.and] : {
                    price : (fields.price != "") ?{[Op.lte] : fields.price} : {[Op.gte] : 0},
                    '$category.name$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.category_name+"%" } : {[Op.like] : "%%" } ,
                    title : (fields.title != "") ? { [Op.like]: "%"+fields.title+"%" } : {[Op.like] : "%%" } ,
                    '$member.name$' : (fields.title != "") ? { [Op.like]: "%"+fields.member_name+"%"} : {[Op.like] : "%%"},
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
                    as : "member",
                    attributes: ['name'],
                },
            ]
        });
        var total_count = count;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/book/serialization", page, limit, total_count, fields);
        res.render("admin/pages/serialization_cover_list", {
            "fields"      : fields,
            "cover_list"       : rows,
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
        const findedBook = await serialization_book.findOne({
            where: {
                id : id
            },
            include : [
                {
                    model: member,
                    as: 'member',
                    attributes : ['name'],
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
        const {count, rows} = await book.findAndCountAll({
            where : {
                serialization_book_id : serialization_book_id,
                status: 1,
            },
            limit : limit,
            offset : offset,
            order : [
                ['created_date_time' ,'DESC']
            ],

        });
        const cover = await serialization_book.findOne({
            where: {
                id: serialization_book_id,
            },
            include : [
                {
                    model: member,
                    as: "member",
                    attributes: ['name'],
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
        const findedBook = await book.findOne({
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

router.post("/serialization/cover", uploadFile, async (req, res, next) => {
    checkLogin(req, res, "/admin/book/serialization/");
    
    let title = req.body.title;
    let serialization_day = req.body.serialization_day;
    let price = req.body.price;
    let member_id = req.body.member_id;
    let author_description = req.body.author_description;
    let book_description = req.body.book_description; 
    let img = req.files.img[0].location;
    let category_name = req.body.category_name;
    try{
        const bookCategory = await category.findOne({
            where: {
                name : category_name,
            }
        });
        const serializationCover = await serialization_book.create({
            title : title,
            price : price,
            serialization_day : serialization_day,
            author_description : author_description,
            book_description : book_description,
            member_id : member_id,
            img : img,
            category_id : bookCategory.id,
        });
        const result = await serialization_book.findOne({
            where: {
                id : serializationCover.id,
            },
            include : [
                {
                    model : member,
                    as : "member",
                    attributes: ['name'],
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
    
    let serialization_book_id = req.body.serialization_book_id;
    let file = req.files.file[0].location;
    let title = req.body.title;
    try{
        const result = await book.create({
            serialization_book_id : serialization_book_id,
            file : file,
            title : title,
            type : 1,
        });
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
        const {count, rows} = await single_published_book.findAndCountAll({
            where: {
                [Op.and] : {
                    price : (fields.price != "") ?{[Op.lte] : fields.price} : {[Op.gte] : 0},
                    '$category.name$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.category_name+"%" } : {[Op.like] : "%%" } ,
                    '$book.title$' : (fields.title != "") ? { [Op.like]: "%"+fields.title+"%" } : {[Op.like] : "%%" } ,
                    '$member.name$' : (fields.title != "") ? { [Op.like]: "%"+fields.member_name+"%"} : {[Op.like] : "%%"},
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
                },
                {
                    model : member,
                    as : "member",
                },
                {
                    model : book,
                    as : "book",
                }
            ]
        });
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
        const findedBook = await single_published_book.findOne({
            where: {
                id : id,
            },
            include: [
                {
                    model: member,
                    as : "member",
                    attributes : ['name'],
                },
                {
                    model : category,
                    as : "category",
                    attributes : ['name'],
                },
                {
                    model : book,
                    as : "book",
                }
            ]
        });
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
    let author_description = req.body.author_description;
    let book_description = req.body.book_description;
    let member_id = req.body.member_id;
    let file = req.files.file[0].location;
    let img = req.files.img[0].location;
    let category_name = req.body.category_name;
    let title = req.body.title;
    try{
        const bookCategory = await category.findOne({
            where: {
                name : category_name,
            }
        });
        const singlePublished = await single_published_book.create({
            price : price,
            content : content,
            page_number : page_number,
            author_description : author_description,
            book_description : book_description,
            member_id : member_id,
            img : img,
            category_id : bookCategory.id,
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
                    as : "member",
                    attributes: ['name'],
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

router.get("/approved/:bookId", async (req,res,next) => {

    checkLogin(req, res, "/admin/member/");
    

    let id = req.params.bookId;

    try{
        await book.update({
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

router.get('/download/:bookId', async (req,res,next) => {
    checkLogin(req, res, "/admin/book/");
    
    
    const bookId = req.params.bookId;
    try{
        const result = await book.findOne({
            where : {
                id : bookId,
            }
        });
        const fileUrl = result.file.split('/');
        const fileUrlLength = fileUrl.length;
        const fileName = fileUrl[fileUrlLength - 1];
        console.log(fileName);
        const url = downloadFile(fileName);
        res.redirect(url);

    }
    catch(err){
        console.error(err);
    }
});


module.exports = router;
