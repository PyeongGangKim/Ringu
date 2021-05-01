var express = require("express");
var router = express.Router();
var sequelize = require("sequelize");

var config_url = require("../../config/url");

var helper_api = require("../../helper/api");
var helper_pagination = require("../../helper/pagination");
var helper_security = require("../../helper/security");
var helper_date = require("../../helper/date");
var helper_activity = require("../../helper/activity");

//var purchase_m = require("../../model/purchase");

const {purchase,book,member, single_published_book, serialization_book} = require("../../models");

router.get("/", async(req, res, next) => {

    helper_activity.checkLogin(req, res, "/admin/purchase/");

    var order_by        = ("order_by" in req.query) ? req.query["order_by"] : "id";
    var order_direction = ("order_direction" in req.query) ? req.query["order_direction"] : "desc";
    var limit           = ("limit" in req.query) ? parseInt(req.query["limit"]) : 10;
    var page            = ("page" in req.query) ? req.query["page"] : 1;
    var offset          = parseInt(limit) * (parseInt(page)-1);
    var member_id       = ("member_id" in req.query) ? req.query["member_id"] : "";

    try {
        const result = await purchase.findAndCountAll({
            /*attributes: [
                'id', 'created_date_time',
                [sequelize.col('member.name'), 'buyer'],
                [sequelize.col('book.title'), 'title'],
                [sequelize.col('book.type'),'type']
            ],*/
            include:[
                { 
                    model: member, 
                    as: 'member', 
                    required: true, 
                    attributes: [],
                    subQuery: false,
                },
                { 
                    model: book, 
                    as: 'book',
                    required: true, 
                    attributes: [],
                    subQuery: false,
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

        let purchase_list = result.rows;
        let count = result.count;

        //const purchase_list = await purchase_m.getList(payload, false);
        //const count = await purchase_m.getList(payload, true);

        var total_count = (count) ? count : 0;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/purchase/", page, limit, total_count, {member_id:member_id});

        res.render("admin/pages/purchase_list", {
            "member_id"         : member_id,
            "limit"             : limit,
            "purchase_list"     : purchase_list,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security,
            "helper_date"       : helper_date
        });
    } catch(err) {
        console.log(err)
    }
});

router.get('/list/user', async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/purchase/list/user/?member_id=" + req.query["member_id"]);
    
    var limit           = ("limit" in req.query) ? parseInt(req.query["limit"]) : 10;
    var page            = ("page" in req.query) ? req.query["page"] : 1;
    var offset          = parseInt(limit) * (parseInt(page)-1);
    let member_id = req.query.member_id;

    try{
        const result = await purchase.findAndCountAll({
            /*attributes : [
                'id', 'created_date_time',
                [sequelize.col('member.name'), 'consumer'],
                [sequelize.col('book.title'), 'book'],
            ],*/
            where: {
                member_id : member_id,
                status : 1,
            },
            offset: offset,
            include : [ 
                {
                    model : member,
                    as : "member",
                    attributes : ['name'],
                },
                {
                    model : book,
                    as : "book",
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
        console.log(purchase_list);
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/purchase/list/user", page, limit, total_count, {member_id:member_id});
        res.render("admin/pages/member_purchase_list", {
            "purchase_list" : purchase_list,
            "total_count" : total_count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security,
            "helper_date"       : helper_date,
            "member"    : user
        })
    }
    catch(err){
        console.error(err);
    }
});
/*
router.get("/view/", async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/purchase/view/?id=" + req.query["id"]);

    var id = helper_security.decrypt(req.query["id"]);

    var payload = {
        member_id: id,
        order_by: "id",
        order_direction: "asc",
        limit: 0,
        offset: 0
    }

    try {
        const purchase_list           = await purchase_m.getList(payload, false);
        const favorite_author_list    = await favorite_author_m.getList(payload, false);
        const favorite_book_list      = await favorite_book_m.getList(payload, false);
        const member                  = await member_m.get({id:id});

        res.render("admin/pages/member_view", {
                    "member"                : member[0],
                    "purchase_list"         : purchase_list,
                    "favorite_author_list"  : favorite_author_list,
                    "favorite_book_list"    : favorite_book_list,
                    "helper_date"           : helper_date,
                    "helper_security"       : helper_security
        });
    } catch(err) {

    }
});*/

router.post("/save/", async(req, res, next) => {

    var member_id  = helper_security.decrypt(req.body["member_id"]);
    var book_id  = req.body["book_id"];

    try {
        let result = await purchase.create({
            member_id   : member_id,
            book_id     : book_id
        })
    } catch(err) {
        console.log(err)
    }

    res.redirect("/admin/member/view/?id=" + req.body["member_id"]);
});

router.get("/delete/", async(req, res, next) => {

    var id = helper_security.decrypt(req.query["id"]);
    var member_id = req.query["member_id"];

    try{
        let result = await purchase.update(
            {status: 0},
            {where:
                {id: id}
            }
        )

        res.redirect("/admin/member/view/?id=" + member_id);

    } catch(err){
        console.log(err)
    }
});

module.exports = router;
