var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");
var helper_date = require("../../helper/date");
const { checkLogin } = require("../../helper/activity");
const {base_url} = require("../../config/url");

const { book, book_recommending_phrase, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");

router.get("/", async (req, res, next) => {
    checkLogin(req, res, "/admin/bookRecommedingPhrase/");

    
    let sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "title"         : ("title" in req.query) ? req.query.title : "",
        "category_name" : ("category_name" in req.query) ? req.query.category_name : "",
        "member_name"   : ("member_name" in req.query) ? req.query.member_name : "",
        "phrase"        : ("phrase" in req.query) ? req.query.phrase : "",
    }

    try{
        const {count, rows} = await book_recommending_phrase.findAndCountAll({
            where: {
                    is_approved : {
                        [Op.in] : fields.is_approved
                    },
                    '$book.category.name$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.category_name+"%" } : {[Op.like] : "%%" },
                    '$book.title' : (fields.title != "") ? { [Op.like]: "%"+fields.title+"%" } : {[Op.like] : "%%" } ,
                    '$book.author.nickname$' : (fields.member_name != "") ? { [Op.like]: "%"+fields.member_name+"%"} : {[Op.like] : "%%"},
                    phrase : (fields.phrase != "") ? { [Op.like]: "%"+fields.phrase+"%" } : {[Op.like] : "%%" },
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
                    model : book,
                    as : "book",
                    include : [
                        {
                            model : category,
                            as : "category",
                        },
                        {
                            model : member,
                            as : "author",
                        },
                    ]
                }
            ]
        });
        console.log(count);
        let total_count = count;
        let renderingPage =  "admin/pages/book_recommending_phrase_list" ; 
        let pagination_html = helper_pagination.html(config_url.base_url + "admin/bookRecommedingPhrase", page, limit, total_count, fields);
        res.render(renderingPage , {
            "fields"      : fields,
            "book_recommending_phrase_list"       : rows,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "limit"             : limit,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/", async(req,res,next) => {
    checkLogin(req, res, "/admin/book/?is_approved=1");

    const book_id = req.body.book_id;
    const phrase = req.body.phrase
    try{
        await book_recommending_phrase.create({
            book_id : book_id,
            phrase : phrase,
        });
        res.redirect(config_url.base_url+ "admin/bookRecommedingPhrase");
    }
    catch(err){
        console.error(err);
    }
})


module.exports = router;
