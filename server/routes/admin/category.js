var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");
var helper_pagination = require("../../helper/pagination");
var helper_activity = require("../../helper/activity");

const {category, Sequelize :{Op} } = require("../../models");


router.get("/", async (req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/category/");
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);
    try{
        let { count, rows } = await category.findAndCountAll({
            offset: offset,
            limit : limit
        });
        let pagination_html = helper_pagination.html(config_url.base_url + "admin/category/", page, limit, count);
        res.render("admin/pages/category_list", {
            "category_list": rows,
            "total_count"       : count,
            "pagination_html"   : pagination_html,
        });

    }
    catch(err){
        console.log(err);
    }
});

router.get("/info/create/", (req, res, next) => {
    
    res.render("admin/pages/category_create");
});

router.post("/", async (req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/category/");
    var name = req.body['name'];
    
    try{
        await category.create({
            name : name,
        });
        res.redirect("/admin/category/");
    }
    catch(err){
        console.log(err);
    }

});


router.get("/info/update/:categoryId", async (req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/category/");
    var id = req.params.categoryId;
    try{
        var result = await category.findOne({
            where: {
                id : id
            }
        });
        res.render("admin/pages/category_update", {
            "id"    : result.id,
            "name"  : result.name,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/update", async (req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/category/");
    var name = req.body.name;
    var id = req.body.id;

    try{
        await category.update({
            name : name
        },{
            where: {
                id : id
            }
        });
        res.redirect("/admin/category/");
    }
    catch(err){
        console.log(err);
    }

});

router.get('/delete/:categoryId', async (req, res, next) => {
    helper_activity.checkLogin(req, res, "/admin/category/");

    var id = req.params.categoryId

    try{

        const result = await category.destroy({
            where: {
                id: id
            }
        });
        res.redirect("/admin/category/");
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;