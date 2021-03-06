var express = require("express");
var router = express.Router();
var sequelize = require("sequelize");

const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const url = require("../../config/url")[env];

var config_url = require("../../config/url");
const logger = require('../../utils/winston_logger');
var helper_api = require("../../helper/api");
var helper_pagination = require("../../helper/pagination");
var helper_security = require("../../helper/security");
var helper_date = require("../../helper/date");
var helper_activity = require("../../helper/activity");

const { review, book_detail, book, member, review_statistic} = require("../../models");

const { adminPageDirPath } = require("../../helper/baseDirectoryPath");

const review_dir = adminPageDirPath + "review/";

router.get("/", async(req, res, next) => {

    helper_activity.checkLogin(req, res, "/admin/review/");

    var order_by        = ("order_by" in req.query) ? req.query["order_by"] : "id";
    var order_direction = ("order_direction" in req.query) ? req.query["order_direction"] : "desc";
    var limit           = ("limit" in req.query) ? parseInt(req.query["limit"]) : 10;
    var page            = ("page" in req.query) ? req.query["page"] : 1;
    var offset          = parseInt(limit) * (parseInt(page)-1);
    var member_id       = ("member_id" in req.query) ? req.query["member_id"] : "";
    var book_id         = ("book_id" in req.query) ? req.query["book_id"] : "";

    try {
        const result = await review.findAndCountAll({
            attributes: [
                'id', 'created_date_time', 'score', 'description',
                [sequelize.col('member.nickname'), 'reviewer'],
                [sequelize.col('book_detail.title'), 'book'],
            ],
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
            ],
            where:{
                status: 1,
            },
            limit: limit,
            offset: offset,
            order: [
                [order_by, order_direction]
            ],
            raw: true
        });

        const review_list = result.rows;
        const count = result.count;
        var total_count = (count) ? count : 0;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/review/", page, limit, total_count, {member_id:member_id, book_id:book_id});

        res.render(review_dir + "list", {
            "member_id"         : member_id,
            "book_id"           : book_id,
            "limit"             : limit,
            "review_list"       : review_list,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security
        });
    } catch(err) {
        logger.error(err);
    }
});


router.get("/view/:reviewId", async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/review/view/" + req.params.reviewId);

    let id = req.params.reviewId;
    try {
        const review_info = await review.findOne({
            attributes: [
                'id', 'created_date_time', 'score', 'description',
                [sequelize.col('member.nickname'), 'reviewer'],
                [sequelize.col('book_detail.title'), 'book'],
            ],
            include:[
                { model: member, as: 'member', required: true, attributes: [] },
                { model: book_detail, as: 'book_detail', required: true, attributes: []}
            ],
            where:{
                status: 1,
                id: id
            },            
            raw: true
        });

        res.render("admin/pages/review_view", {
                    "review"                : review_info,
                    "helper_date"           : helper_date,
                    "helper_security"       : helper_security
        });

    } catch(err) {
        logger.error(err);
    }
});

router.post("/save/", async(req, res, next) =>  {

    var member_id   = helper_security.decrypt(req.body["member_id"]);
    var book_id     = req.body["book_id3"];
    var score       = req.body["score"];
    var description = req.body["description"];

    try {
        await review.create({
            member_id   : member_id,
            book_id     : book_id,
            score       : score,
            description : description
        })

        res.redirect("/admin/member/view/?id=" + req.body["member_id"]);
    } catch(err){
        logger.error(err);
    }
});

router.get("/delete/", async(req, res, next) => {

    helper_activity.checkLogin(req, res, "/admin/review/");

    var id = helper_security.decrypt(req.query["id"]);
    var member_id = req.query["member_id"];

    try{
        await review.update(
            {status: 0},
            {where:
                {id: id}
            }
        )

        res.redirect("/admin/member/view/?id=" + member_id);

    } catch(err){
        logger.error(err);
    }
});


module.exports = router;
