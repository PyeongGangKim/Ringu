var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");
const logger = require('../../utils/winston_logger');
var helper_api = require("../../helper/api");
var helper_pagination = require("../../helper/pagination");
var helper_security = require("../../helper/security");
var helper_date = require("../../helper/date");

const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const url = require("../../config/url")[env];

var favorite_author = require("../../models").favorite_author;


router.post("/save/", async(req, res, next) => {

    var member_id  = helper_security.decrypt(req.body["member_id"]);
    var author_id  = req.body["author_id"];

    try {
        await favorite_author.create({
            member_id: member_id,
            author_id: author_id
        })

        res.redirect("/admin/member/view/?id=" + req.body["member_id"]);

    } catch(err){
        logger.error(err);
    }

});

router.get("/delete/", async(req, res, next) =>  {

    var id = helper_security.decrypt(req.query["id"]);
    var member_id = req.query["member_id"];

    try{
        favorite_author.update(
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
