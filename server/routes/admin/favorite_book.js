var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_api = require("../../helper/api");
var helper_pagination = require("../../helper/pagination");
var helper_security = require("../../helper/security");
var helper_date = require("../../helper/date");

//var favorite_book_m = require("../../model/favorite_book");
var favorite_book = require("../../models").favorite_book;


router.post("/save/", async(req, res, next) =>  {

    var member_id  = helper_security.decrypt(req.body["member_id"]);
    var book_id  = req.body["book_id2"];

    try {
        await favorite_book.create({
                member_id: member_id,
                book_id: book_id
        })

        res.redirect("/admin/member/view/?id=" + req.body["member_id"]);
    } catch(err){
        console.log(err)
    }

});

router.get("/delete/", async(req, res, next) =>  {

    var id = helper_security.decrypt(req.query["id"]);
    var member_id = req.query["member_id"];

    try{
        await favorite_book.update(
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
