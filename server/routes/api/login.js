var express = require("express");
var router = express.Router();
let jwt = require('jsonwebtoken');

var member = require("../../model/member");

router.post("/", async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try {
        const result = await member.login(email, password)

        if(result.status === "ok"){
            let member = result.data

            const token = jwt.sign({
                id: member.id
            }, req.app.get('jwt-secret'), {
                expiresIn: '12h',
                issuer: 'ringu',
            });            
            res.json({status:"ok", token})
        } else{
            res.json({
                status: "error",
                reason: "not match"
            })
        }
    } catch(err) {
        res.json({status:"error", error:err, reason:"login fail"})
    }
});

module.exports = router;
