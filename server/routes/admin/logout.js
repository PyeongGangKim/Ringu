var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    req.session.sess_is_login = 0;
    res.redirect("/admin/login/");
});

module.exports = router;
