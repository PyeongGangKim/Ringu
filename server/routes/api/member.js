var express = require("express");
var router = express.Router();

const bcrypt = require('bcrypt');
const multer = require("multer");

var helper_api = require("../../helper/api");
var helper_security = require("../../helper/security");
const {StatusCodes} = require("http-status-codes");
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
            res.status(StatusCodes.OK).json({
                user: user,
            })
        }
        else {
            res.status(StatusCodes.NO_CONTENT);
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
            res.status(StatusCodes.OK).json({
                check: true,
            });
        }
        else{
            res.status(StatusCodes.OK).json({
                check: false,    
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

})
router.put('/password/', isLoggedIn, async (req, res, next) => {
    try{
        // patch로 바꿔야됨
        var id = req.user.id;
        let _salt = await bcrypt.genSalt(salt);
        var password = await bcrypt.hash(req.body.password, _salt);

        const result = await member.update({
            password : password
        },{
            where: {
                id : id
            },
        });

        res.status(StatusCodes.OK).json({
            member: result
        })
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
            res.status(StatusCodes.CONFLICT).json({
                "message" : "duplicate",
            });
        }
        else{
            res.status(StatusCodes.OK);
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

router.put('/nickname', isLoggedIn, async (req, res, next) => {
    let id = req.user.id;
    let nickname = req.body.nickname;
    // patch로 변경필요
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
            res.status(StatusCodes.OK).json({
                "member" : result,
            });
        }
        
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
            res.status(StatusCodes.OK);
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});


module.exports = router;
