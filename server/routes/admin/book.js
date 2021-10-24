var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");
var helper_date = require("../../helper/date");
const { checkLogin } = require("../../helper/activity");
const {base_url} = require("../../config/url");

const { uploadFile, deleteFile, downloadFile } = require("../../middlewares/third_party/aws");

const { book, notiCount, favorite_author ,notification, category, member, book_detail, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");
const { dontKnowTypeStringOrNumber } = require("../../helper/typeCompare");

router.get("/", async (req, res, next) => {
    //is_approved을 query string으로 받아서, 발간된 거 찾는 것인지, 발간되지 않은 거 찾는 것인지 구분.
    //book_detail에서, where문으로 is_approved 확인하기.
    //book join해주고, book안에 category, author 조인 해준다.
    //근데 nested할 때, where문을 어떻게 쓰느냐가 중요함.
    checkLogin(req, res, "/admin/member/");

    
    let sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "title"         : ("title" in req.query) ? req.query.title : "",
        "price"         : ("price" in req.query) ? req.query.price : "",
        "category_name" : ("category_name" in req.query) ? req.query.category_name : "",
        "member_name"   : ("member_name" in req.query) ? req.query.member_name : "",
        "is_picked"     : ("is_picked" in req.query) ? [req.query.is_picked] : [0,1],
        "is_recommending_phrase" : ("is_recommending_phrase" in req.query) ? [req.query.is_recommending_phrase] : [0,1],
    }

    try{
        const {count, rows} = await book.findAndCountAll({
            where: {
                    is_picked : {
                        [Op.in] : fields.is_picked
                    },
                    is_recommending_phrase: {
                        [Op.in] : fields.is_recommending_phrase
                    },
                    price : (fields.price != "") ?{[Op.lte] : fields.price} : {[Op.gte] : 0},
                    '$category.name$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.category_name+"%" } : {[Op.like] : "%%" } ,
                    title : (fields.title != "") ? { [Op.like]: "%"+fields.title+"%" } : {[Op.like] : "%%" } ,
                    '$author.nickname$' : (fields.title != "") ? { [Op.like]: "%"+fields.member_name+"%"} : {[Op.like] : "%%"},
                status : 1,
            },
            limit : limit,
            offset : offset,
            order : [
                [sort_by, sort_direction],
            ],
            include : [
                {
                    required: true,
                    model : category,
                    as : "category",
                    //attributes: ['name'],
                },
                {
                    required: true,
                    model : member,
                    as : "author",
                    //attributes: ['nickname'],
                },
                {
                    required: true,
                    model: book_detail,
                    as : "book_details",
                    attributes: ['page_number', 'round','id'],
                    where: {
                        [Op.or] : [
                            {
                                round : 1,
                            },
                            {
                                round : {
                                    [Op.is] : null,
                                }
                            }

                        ]
                    }
                    
                },
            ]
        });
        console.log(count);
        let total_count = count;
        let renderingPage = "";
        renderingPage = (dontKnowTypeStringOrNumber(fields.is_recommending_phrase, 1)) ? "admin/pages/bookRecommendingPhraseList" : renderingPage;
        renderingPage = (dontKnowTypeStringOrNumber(fields.is_picked, 1)) ? "admin/pages/pickedBookList" : renderingPage;
        let pagination_html = helper_pagination.html(config_url.base_url + "admin/book/?is_approved=" + fields.is_approved, page, limit, total_count, fields);
        res.render(renderingPage , {
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


router.get("/serialization/cover", async (req, res, next) => {//연재본 커버만 보여주기.
    
    checkLogin(req, res, "/admin/book/serialization/cover/" + "?is_approved="+ req.query.is_approved);

    let sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "title"         : ("title" in req.query) ? req.query.title : "",
        "price"         : ("price" in req.query) ? req.query.price : "",
        "is_approved"   : ("is_approved" in req.query) ? [req.query.is_approved] : [0,1],
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
                    '$author.nickname$' : (fields.member_name != "") ? { [Op.like]: "%"+fields.member_name+"%"} : {[Op.like] : "%%"},
                    is_approved : {
                        [Op.in] : fields.is_approved
                    },
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
        let renderingPage = (dontKnowTypeStringOrNumber(fields.is_approved,1)) ? "admin/pages/approved_serialization_cover_list" : "admin/pages/unapproved_serialization_cover_list" ; 
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/book/serialization", page, limit, total_count, fields);
        res.render(renderingPage , {
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
    checkLogin(req, res, "/admin/book/serialization/"+req.params.serializationId);

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
    checkLogin(req, res, "/admin/book/serialization/content/list");

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
    
    checkLogin(req, res, "/admin/book/serialization/content" + req.params.bookId);
    

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

    checkLogin(req, res, "/admin/book/singlePublished/"+ "?is_approved="+ req.query.is_approved);
    

    let sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "title"         : ("title" in req.query) ? req.query.title : "",
        "price"         : ("price" in req.query) ? req.query.price : "",
        "is_approved"   : ("is_approved" in req.query) ? [req.query.is_approved] : [0,1],
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
                        [Op.like] : (fields.member_name != "") ? ("%"+fields.member_name+"%") : ("%%")
                    },
                    is_approved : {
                        [Op.in] : fields.is_approved
                    },
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
        var total_count = count;
        let renderingPage = (dontKnowTypeStringOrNumber(fields.is_approved,1)) ? "admin/pages/approved_single_published_book_list" : "admin/pages/unapproved_single_published_book_list" ; 
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/book/singlePublished", page, limit, total_count, fields);
        res.render(renderingPage, {
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
router.get("/unapproved/reason", async (req, res, next) => {
    checkLogin(req, res, "/unapproved/reason");
    const book_id = req.query.book_id;
    try{
        const rejecting_book = await book.findOne({
            where: {
                id : book_id
            }
        });
        res.render("admin/pages/reject_approving_book",{
            "book"                  : rejecting_book,
            "helper_date"           : helper_date,
        });
    }
    catch(err){
        console.error(err);
    }
});

router.post("/unapproved/:bookId", async(req, res, next) => {
    // book_detail model에 is_approved 를 -1 로 바꿔준다.
    // 그리고 notification 해줘야 된다.
    // notification에 넣어줄 때, type을 출간 거절로 넣어주고
    //checkLogin(req, res, "/unapproved/" + req.params.bookDetailId);
    const book_id = req.params.bookId;
    const reason = req.body.reason;
    const t = await sequelize.transaction();
    try{
        await book_detail.update({
            is_approved : -1
        },
        {
            where: {
                id : book_id,
            }
        });
        const getMemberByBook = await book.findOne({//해당 책에 작가의 member_id를 알아와야됨.
            where: {
                id: book_id,
            },
            include: [
                {
                    model: member,
                    as : 'author',
                    attributes: ['id'],
                }
            ]
        });
        let notiMember = getMemberByBook.author.id;
        let title = getMemberByBook.title + "이 출간 거부 됐습니다."
        try{
            const noti = await notification.create({
                title: title,
                content: reason,
                member_id : notiMember,
                type: 1, // 책 출간에 관한 건 type 1
            },{transaction: t});

            const [notiC, created] = await notiCount.findOrCreate({
                where: {
                    member_id : notiMember,
                },
                defaults: {
                    member_id: notiMember,
                    count: 0,
                },
                transaction : t,
            });
            await notiCount.update({
                count : notiC.count + 1,
            },
            {
                where:{
                    id : notiC.id,
                },
                transaction: t
            });
            await t.commit();
            res.redirect("/admin/book/book_detail?is_approved=0");
            
        }
        catch(err){
            await t.rollback();
            console.error(err);
        }
    }
    catch(err){
        console.error(err);
    }
});

router.get("/approved/:bookId", async (req,res,next) => {
    // approved로 book의 author를 얻어 내서 해당 author를 팔로우 한 친구들한테만 Notify하기
    checkLogin(req, res, "/admin/member/");


    let id = req.params.bookId;
    console.log(id);
    try{
        await book.update({
            is_approved : 1
        },{
            where: {
                id : id
            } 
        });
    }
    catch(err){
        console.log(err);
    }
    try{
        let approved_book = await book.findOne({
            where: {
                id: id
            },
            include : [
                {
                    model: member,
                    as : "author",
                }
            ]
        });

        // 해당 작가를 follow 하고 있는 모든 데이터 얻어내기
        let followed_author_id =  approved_book.author_id;
        let followed_author_name = approved_book.author.nickname;
        let book_title = approved_book.title;
        let following_members = await favorite_author.findAll({
            attributes: [
                "member_id",
            ],
            where: {
                author_id : followed_author_id,
                status: 1,
            }
        });
        const t = await sequelize.transaction();
        let noti_title = followed_author_name + "작가님의 " + book_title + " 책이 출간되었습니다.";
        let noti_content = "지금 바로 확인해 보세요!";
        let insert_noti = [];
        for(let following_member of following_members){
            insert_noti.push({
                member_id : following_member.member_id,
                content: noti_content,
                title: noti_title,
                type : 1,
            })
        }
        try{
            await notification.bulkCreate(insert_noti,{
                transaction: t,
            });
            for(let following_member of following_members){
                let [notiC, created] = await notiCount.findOrCreate({
                    where: {
                        member_id: following_member.member_id,
                    },
                    defaults: {
                        member_id: following_member.member_id,
                        count: 0,
                    },
                    transaction: t,
                });
                await notiCount.update({
                    count : notiC.count + 1,
                },
                {
                    where : {
                        id : notiC.id,
                    },
                    transaction: t,
                });
            }
            await t.commit();
            res.redirect("/admin/member/");
        }
        catch(err){
            await t.rollback();
            console.error(err);
        }
        
    }
    catch(err){
        console.log(err);
    }
});

router.get('/:bookDetailId/update/page', async(req, res, next) => {
    checkLogin(req, res, "/admin/book/:bookDetailId/upadte/page");

    const book_detail_id = req.params.bookDetailId;

    try{
        const updatedBook = await book_detail.findOne({
            where: {
                id : book_detail_id,
            }
        });
        res.render("admin/pages/book_detail_update", {
            "book": updatedBook,
            "helper_date": helper_date,
        });
    }
    catch(err){
        console.error(err);
    }
});
router.post('/:bookDetailId/update', async(req, res, next) => {
    checkLogin(req, res, "/admin/book/:bookDetailId/update/page");

    const book_detail_id = req.params.bookDetailId;
    const title = req.body.title;
    const page_number = req.body.page_number;
    const charge = req.body.charge;

    try{
        const isUpdate = await book_detail.update({
            title: title,
            page_number: page_number,
            charge : charge,
        },
        {
            where: {
                id : book_detail_id,
            }
        });
        if(isUpdate){
            const updatedBook = await book_detail.findOne({
                where: {
                    id: book_detail_id,
                }
            });
            res.render("admin/pages/book_detail_update", {
                "book": updatedBook,
                "helper_date": helper_date,
            });
        }
        
    }
    catch(err){
        console.error(err);
    }
});
router.get('/:bookId/pickedForm', async(req, res, next) => {
    const book_id = req.params.bookId;
    try{
        const pickedBook = await book.findOne({
            where: {
                id: book_id,
            }
        });
        res.render("admin/pages/pickedForm",{
            book: pickedBook,
        });
    }
    catch(err){
        console.error(err);
    }
});
router.get('/:bookId/bookRecommendingPhraseForm', async(req, res, next) => {
    const book_id = req.params.bookId;
    try{
        const recommendingBook = await book.findOne({
            where: {
                id: book_id,
            }
        });
        res.render("admin/pages/bookRecommendingPhraseForm",{
            book: recommendingBook,
        });
    }
    catch(err){
        console.error(err);
    }
    
});
router.post('/:bookId/picked', async (req,res,next) => {
    checkLogin(req, res, "/admin/book/" + "?is_approved=1");
    const bookId = req.params.bookId;
    const is_picked = 1;
    const rank = req.body.rank;
    try{
        const result = await book.update(
            {
                is_picked : is_picked,
                rank : rank
            },
            {
                where: {
                    id : bookId,
                }
            }
        );
        const url = base_url + "admin/book/?is_picked=1"  
        res.redirect(url);
    }  
    catch(err){
        console.error(err);
    }
});

router.post('/:bookId/recommendingPhrase', async (req,res,next) => {
    checkLogin(req, res, "/admin/book/" + "?is_approved=1");
    const bookId = req.params.bookId;
    const is_recommending_phrase = 1;
    const recommending_phrase = req.body.recommending_phrase;
    try{
        const result = await book.update(
            {
                is_recommending_phrase : is_recommending_phrase,
                recommending_phrase : recommending_phrase
            },
            {
                where: {
                    id : bookId,
                }
            }
        );
        const url = base_url + "admin/book/?is_recommending_phrase=1"  
        res.redirect(url);
    }  
    catch(err){
        console.error(err);
    }
});

router.get('/:bookId/unpicked', async (req,res,next) => {
    checkLogin(req, res, "/admin/book/" + "?is_approved=1");
    const bookId = req.params.bookId;
    const is_picked = 0;
    const rank = 0;
    try{
        const result = await book.update(
            {
                is_picked : is_picked,
                rank : rank
            },
            {
                where: {
                    id : bookId,
                }
            }
        );
        const url = base_url + "admin/book/?is_picked=1"  
        res.redirect(url);
    }  
    catch(err){
        console.error(err);
    }
});

router.get('/:bookId/unrecommendingPhrase', async (req,res,next) => {
    checkLogin(req, res, "/admin/book/" + "?is_approved=1");
    const bookId = req.params.bookId;
    const is_recommending_phrase = 0;
    const recommending_phrase = null;
    try{
        const result = await book.update(
            {
                is_recommending_phrase : is_recommending_phrase,
                recommending_phrase : recommending_phrase
            },
            {
                where: {
                    id : bookId,
                }
            }
        );
        const url = base_url + "admin/book/?is_picked=1"  
        res.redirect(url);
    }  
    catch(err){
        console.error(err);
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
        res.redirect(url);

    }
    catch(err){ 
        console.error(err);
    }
});

module.exports = router;
