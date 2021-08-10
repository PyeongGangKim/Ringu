var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const bcrypt = require('bcrypt');
const multer = require("multer");

var helper_api = require("../../helper/api");
var helper_security = require("../../helper/security");
//var helper_email = require("../../helper/email");
var helper_random = require("../../helper/random");
var helper_date = require("../../helper/date");


let { member } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");
const { uploadFile, imageLoad } = require("../../middlewares/third_party/aws");

const { upload } = require('../../utils/aws');


const { salt } = require("../../config/salt");
const aws = require("../../utils/aws");

router.get('/', isLoggedIn, async(req, res, next) => {
    var id = req.query.id;

    try{
        const user = await member.findOne({
            where : {
                id: id
            }
        });

        if(user){
            res.json({status: "ok", user});
        }
        else {
            res.json({status: "error", reason: "not matching"});
        }
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "api error",
        });
    }
})

router.get('/profile/:memberId', isLoggedIn, async(req, res, next) => {
    var id = req.params.memberId

    try {
        const result = await member.findOne({
            where: {
                id: id,
            }
        });

        const url = imageLoad(result.profile)

        console.log(url)
        res.status(StatusCodes.OK).json({
            "url" : url,
        });
    }
    catch(err){
        console.error(err);
    }
})

router.post('/password/check', isLoggedIn, async(req, res, next) => {
    try{
        let password = req.body.password;

        const result = await bcrypt.compare(password, req.user.password);

        if(result){
            res.json({status: "ok", result: true});
        }
        else{
            res.json({status: "error", reason: "wrong password", result: false});
        }
    }
    catch(err){
        console.error(err);
    }

})
router.put('/password/', isLoggedIn, async (req, res, next) => {
    try{
        // POST
        var id = req.user.id;
        var salt = await bcrypt.genSalt(salt);
        var password = await bcrypt.hash(req.body.password, salt);

        const result = await member.update({
            password : password
        },{
            where: {
                id : id
            },
        });

        if(result){
            res.json({status : "ok", result});
        }
        else{
            res.json({status: "error", reason: "password update error"});
        }
    }
    catch(err){
        console.error(err);
    }

    // DB LOAD

});
router.post('/nickname/duplicate', isLoggedIn, async(req, res, next) => {
    let nickname = req.body.nickname;
    try{
        const result = await member.findAll({
            where: {
                nickname : nickname,
            }
        });
        if(result.length != 0){
            res.json({status: "error", reason: "duplicate"});
        }
        else{
            res.json({status: "ok"});
        }
    }
    catch(err){
        console.error(err);
    }
});

router.put('/nickname', isLoggedIn, async (req, res, next) => {
    let id = req.user.id;
    let nickname = req.body.nickname;

    try{
        const result = await member.update({
            nickname : nickname,
        },
        {
            where : {
                id : id,
            }
        });
        if(result){
            res.json({status: "ok", result});
        }
        else{
            res.json({status: "error", reason: "name update error"});
        }
    }
    catch(err){
        console.error(err);
    }

});

router.post("/upload_profile", isLoggedIn, uploadFile, async(req, res, next) => {
    let id = req.user.id;
    let profile = req.files.img[0].key;

    try{
        const result = await member.update({
            profile : profile,
        },
        {
            where : {
                id : id,
            }
        });
        if(result){
            res.json({status: "ok", result});
        }
        else{
            res.json({status: "error", reason: "name update error"});
        }
    }
    catch(err){
        console.error(err);
    }

})

router.delete('/', isLoggedIn, async (req, res, next) => {
    let id = req.user.id;

    try{
        const result = await member.update({
            status: 0,
        },
        {
            where: {
                id : id,
            }
        });
        if(result){
            res.json({status : "ok"});
        }
        else{
            res.json({status: "error", reason: "user delete error"});
        }
    }
    catch(err){
        console.error(err);
    }
});


module.exports = router;
