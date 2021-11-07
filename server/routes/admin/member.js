var express = require("express");
var router = express.Router();


var config_url = require("../../config/url");

var helper_api = require("../../helper/api");
var helper_pagination = require("../../helper/pagination");
var helper_security = require("../../helper/security");
var helper_date = require("../../helper/date");
var helper_activity = require("../../helper/activity");


const { book, purchase, favorite_author ,review, favorite_book, member, reward_stat, Sequelize : { Op }, sequelize } = require("../../models/index");

router.get("/", async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/member/");

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
                    as: "reward_stat",
                    required: false,
                },                
            ],
            order: [
                [order_by, order_direction]
            ],
        });
        

        let member_list = result.rows;
        console.log(member_list);
        let count = result.count;
        var pagination_html = helper_pagination.html(config_url.base_url + "admin/member/", page, limit, count, fields);

        res.render("admin/pages/member_list", {
            "fields"            : fields,
            "limit"             : limit,
            "member_list"       : member_list,
            "total_count"       : count,
            "pagination_html"   : pagination_html,
            "helper_security"   : helper_security
        });
    } catch(err) {
        console.log(err)
    }
});

router.get("/view/", async(req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/member/view/?id=" + req.query["id"]);

    var id = helper_security.decrypt(req.query["id"]);
    var payload = {
        member_id   : id,
        status      : 1,
    }

    let offset = 0;
    let limit = 10;

    try {
        const purchase_list = await purchase.findAll({
            attributes: [
                'id', 'created_date_time',
                [sequelize.col('book.title'), 'title'],
                [sequelize.col('book.price'), 'price'],
                [sequelize.col('book.type'),'type']
            ],
            include:[
                { model: book, as: 'book', required: true,attributes: [] }
            ],
            where: payload,
            limit: limit,
            offset: offset,
            raw: true
        });

        const favorite_author_list = await favorite_author.findAll({
            attributes: [
                'id', 'created_date_time',
                [sequelize.col('member.name'), 'name'],
                [sequelize.col('member.email'), 'email'],
            ],
            include:[
                { model: member, as: 'member', required: true, attributes: [] }
            ],
            where: payload,
            limit: limit,
            offset: offset,
            raw: true
        })

        const favorite_book_list = await favorite_book.findAll({
            attributes: [
                'id', 'created_date_time',
                [sequelize.col('book.title'), 'title'],
                [sequelize.col('book.price'), 'price'],
            ],
            include:[
                { model: book, as: 'book', required: true, attributes: [] }
            ],
            where: payload,
            limit: limit,
            offset: offset,
            raw: true
        })

        const review_list = await review.findAll({
            attributes: [
                'id', 'score', 'description',
                [sequelize.col('member.email'), 'customer'],
                [sequelize.col('book.title'), 'book'],
            ],
            include:[
                { model: member, as: 'member', required: true, attributes: [] },
                { model: book, as: 'book', required: true, attributes: [] }
            ],
            where: payload,
            limit: limit,
            offset: offset,
            raw: true
        })

        const member_info = await member.findByPk(id);

        res.render("admin/pages/member_view", {
                    "member_info"           : member_info,
                    "purchase_list"         : purchase_list,
                    "favorite_author_list"  : favorite_author_list,
                    "favorite_book_list"    : favorite_book_list,
                    "review_list"           : review_list,
                    "helper_date"           : helper_date,
                    "helper_security"       : helper_security
        });

    } catch(err) {
        console.log(err)
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
        console.log(err)
    }
});

module.exports = router;
