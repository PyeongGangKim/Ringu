const express = require("express");
const bcrypt = require("bcrypt");

//var member = require("../../model/member");
const member = require("../../models").member;
const { secretKey } = require('../../config/jwt_secret');

const router = express.Router();

router.get("/", function(req, res, next) {

    var attempt = ("attempt" in req.query) ? true : false;
    var rurl = ("rurl" in req.query) ? req.query["rurl"] : "";

    res.render("admin/pages/login", {"attempt" : attempt, "rurl" : rurl});
});

router.post("/attempt/", async(req, res, next) => {
    // POST
    let email       = req.body["email"];
    let password    = req.body["password"];
    let rurl        = req.body["rurl"];

    try {
        // GET EMAIL
        let result = await member.findOne({
            where: {email: email}
        })

        if (result) {
            const pwd_result = await bcrypt.compare(password, result.password);
            if(pwd_result && result.is_admin){
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
