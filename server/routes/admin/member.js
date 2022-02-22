var express = require("express");
var router = express.Router();


var config_url = require("../../config/url");
const logger = require('../../utils/winston_logger');

const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const url = require("../../config/url")[env];

var helper_pagination = require("../../helper/pagination");
var helper_security = require("../../helper/security");
var helper_date = require("../../helper/date");
var helper_activity = require("../../helper/activity");

const { adminPageDirPath } = require("../../helper/baseDirectoryPath");

const { book, purchase, favorite_author ,review, favorite_book, member, reward_stat, book_detail,Sequelize : { Op }, sequelize } = require("../../models/index");

const member_dir = adminPageDirPath + "member/";

router.get("/", async(req, res, next) => {
//    helper_activity.checkLogin(req, res, "/admin/member/");

    var order_by        = ("order_by" in req.query) ? req.query["order_by"] : "id";
    var order_direction = ("order_direction" in req.query) ? req.query["order_direction"] : "desc";
    var limit           = ("limit" in req.query) ? parseInt(req.query["limit"]) : 10;
    var page            = ("page" in req.query) ? req.query["page"] : 1;
    var offset          = parseInt(limit) * (parseInt(page)-1);

    var fields = {"status" : 1}
    if ("name" in req.query) fields["name"] = req.query["name"]
    if ("email" in req.query) fields["email"] = req.query["email"]
    if ("tel" in req.query) fields["tel"] = req.query["tel"]

    try {
        const result = await member.findAndCountAll({
            where: fields,
            limit: limit,
            offset: offset,
            include: [
                {
                    model: reward_stat,
                    as: "reward_stats",
                    required: false,
                },                
            ],
            order: [
                [order_by, order_direction]
            ],
        });
        

        let member_list = result.rows;
        let count = result.count;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/member/", page, limit, count, fields);

        res.render(member_dir + "list", {
            "fields"            : fields,
            "limit"             : limit,
            "member_list"       : member_list,
            "total_count"       : count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security
        });
    } catch(err) {
        logger.error(err.stack);
    }
});

router.get('/:memberId/purchase', async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/purchase/list/user/?member_id=" + req.query["member_id"]);
    
    var limit           = ("limit" in req.query) ? parseInt(req.query["limit"]) : 10;
    var page            = ("page" in req.query) ? req.query["page"] : 1;
    var offset          = parseInt(limit) * (parseInt(page)-1);
    let member_id = req.params.memberId;

    try{
        const result = await purchase.findAndCountAll({
            where: {
                member_id : member_id,
                status : 1,
            },
            offset: offset,
            include : [ 
                {
                    model : member,
                    as : "member",
                    attributes : ['nickname'],
                },
                {
                    model : book_detail, 
                    as : "book_detail",
                    attributes : ['title'],
                }
            ]
        });
        const user = await member.findOne({
            where: {
                id : member_id,
            }
        });
        const purchase_list = result.rows;
        const total_count = result.count;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/purchase/list/user", page, limit, total_count, {member_id:member_id});
        res.render(member_dir + "purchase_list", {
            "purchase_list" : purchase_list,
            "total_count" : total_count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security,
            "helper_date"       : helper_date,
            "member"    : user
        })
    }
    catch(err){
        logger.error(err.stack);
    }
});
router.get('/:memberId/review', async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/review/view/?id=" + req.query["id"]);
    
    
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let member_id = req.params.memberId;

    try{
        const result = await review.findAndCountAll({
            attributes : [
                'id', 'created_date_time', 'score', 'description',
                [sequelize.col('member.nickname'), 'reviewer'],
                [sequelize.col('book_detail.title'), 'book'],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            offset : offset,
            include : [ 
                {
                    model : member,
                    as : "member",
                    attributes : ['nickname'],
                },
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : ['title'],
                }
            ]
        });
        const user = await member.findOne({
            where: {
                id : member_id,
            }
        });
        const review_list = result.rows;
        const total_count = result.count;
        console.log(review_list);
        
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/review/list/user", page, limit, total_count, {member_id: member_id});
        res.render(member_dir + "review_list", {
            "review_list" : review_list,
            "total_count" : total_count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security,
            "helper_date"       : helper_date,
            "member"    : user,
        });
    }
    catch(err){
        logger.error(err.stack);
    }
});


router.get("/delete/", async(req, res, next) => {

    helper_activity.checkLogin(req, res, "/admin/member/");

    var id = helper_security.decrypt(req.query["id"]);

    try{
        let result = await member.update(
            {status: 0},
            {where:
                {id: id}
            }
        )
        res.redirect("/admin/member/");
    } catch(err){
        logger.error(err.stack);
    }
});

module.exports = router;
