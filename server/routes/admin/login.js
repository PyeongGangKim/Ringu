var express = require("express");
var bcrypt = require("bcrypt");

//var member = require("../../model/member");
var member = require("../../models").member;

var router = express.Router();

router.get("/", function(req, res, next) {

    var attempt = ("attempt" in req.query) ? true : false;
    var rurl = ("rurl" in req.query) ? req.query["rurl"] : "";

    res.render("admin/pages/login", {"attempt" : attempt, "rurl" : rurl});
});

router.post("/attempt/", async(req, res, next) => {
    // POST
    var email       = req.body["email"];
    var password    = req.body["password"];
    var rurl        = req.body["rurl"];

    try {
        // GET EMAIL
        var result = await member.findOne({
            where: {email: email}
        })

        if (result) {
            if(result.password == password && result.is_admin == 1){
                req.session.sess_is_login = 1;

                if (rurl != "") {                    
                    res.redirect(rurl);
                } else {
                    res.redirect("/admin/member/");
                }
                return;
            }

            res.redirect("/admin/login/?attempt=0");
            return;
        }
    } catch(err) {
        console.log(err)
    }
});

module.exports = router;
