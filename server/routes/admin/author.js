var express = require("express");
var router = express.Router();

const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const url = require("../../config/url")[env];

var helper_pagination = require("../../helper/pagination");
var helper_date = require("../../helper/date");
const { checkLogin }= require("../../helper/activity");
const helper_security = require("../../helper/security");
const logger = require('../../utils/winston_logger');
const {member, author, Sequelize : { Op } } = require("../../models");

const { adminPageDirPath } = require("../../helper/baseDirectoryPath");

const author_dir = adminPageDirPath + "author/";

router.get("/",async (req, res, next) => {

    checkLogin(req,res, "/admin/author");

    var sort_by         = ("sort_by" in req.query) ? req.query.sort_by : "id";
    var sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    var limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    var page            = ("page" in req.query) ? req.query.page : 1;
    var offset          = parseInt(limit) * (parseInt(page)-1);

    
    var fields = {
        "member_name"         : ("title" in req.query) ? req.query.title : "",
        "name"         : ("price" in req.query) ? req.query.price : "",
    }
    try{
        const {count, rows} = await author.findAndCountAll({
            where: {
                [Op.or] : {
                    name : ("name" in fields && fields.name != "") ? {[Op.like] : "%"+fields.name+"%" } : {[Op.like] : "%%" } ,
                    '$member.nickname$' : ("member_name" in fields && fields.member_name != "") ? { [Op.like]: "%"+fields.member_name+"%" } : {[Op.like] : "%%" } ,
                },
                status : 1,
            },
            limit : limit,
            offset : offset,
            order : [
                [sort_by, sort_direction]
            ],
            
            include : {
                model : member,
                as : "member",
            }
        });
    
        var total_count = count;
        var pagination_html = helper_pagination.html(url.base_url + "admin/author/", page, limit, total_count, fields);
        res.render(author_dir + "list", {
            "fields"      : fields,
            "author_list"       : rows,
            "limit"             : limit,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security
        });
    }
    catch(err){
        logger.error(err);
    }
});
router.get("/info/create/", (req, res, next) => {
    
    res.render(author_dir + "create");
});

router.post("/", async (req, res, next) => {
    checkLogin(req,res, "/admin/author");
    
    let fields = req.body;
    try{
        const result = await author.create({
            name : fields.name,
            bank : fields.bank,
            account : fields.account,
            description : fields.description,
            member_id : fields.member_id,
            tax_agreement : (fields.tax_agreement) ? 1 : 0,
            promotion_agency_agreement : (fields.promotion_agency_agreement) ? 1 : 0,
        });
        res.render(author_dir + "view",{
            "author"                  : result,
            "helper_date"           : helper_date,
        })
    }
    catch(err){
        logger.error(err);
    }
})

router.get("/:authorId", async (req, res, next) => {

    checkLogin(req,res, "/admin/author/" + req.params.authorId);
    

    var id = req.params.authorId;
    try{
        var findedAuthor = await author.findOne({
            where: {
                id : id
            },
            include : {
                model : member,
                as : "member",
            }
        });
        res.render(author_dir + "view", {
                "author"                  : findedAuthor,
                "helper_date"           : helper_date,
        });
    }
    catch(err){
        logger.error(err);
    }
});

router.get("/delete/:authorId", async (req, res, next) => {

    checkLogin(req, res, "/admin/author/");
    

    var idx = req.params.authorId;
    try{
        await author.update({
            status : 0
        },{
            where: {
                id : idx
            }
        });
        res.redirect("/admin/author/");
    }
    catch(err){
        logger.error(err);
    }
});



module.exports = router;
