var express = require("express");
var router = express.Router();
var axios = require('axios');
var iamport = require("../../config/iamport");

let jwt = require('jsonwebtoken');
const { secretKey } = require('../../config/jwt_secret');

const bcrypt = require('bcrypt');
const multer = require("multer");

var helper_api = require("../../helper/api");
var helper_security = require("../../helper/security");
//var helper_email = require("../../helper/email");
var helper_random = require("../../helper/random");
var helper_date = require("../../helper/date");

const {StatusCodes} = require("http-status-codes");

let { member } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");
const { uploadFile, imageLoad } = require("../../middlewares/third_party/aws");

const { upload } = require('../../utils/aws');


const { salt } = require("../../config/salt");
const aws = require("../../utils/aws");

router.get('/', isLoggedIn, async(req, res, next) => {
    var id = req.user.id;

    try{
        const user = await member.findOne({
            attributes: [
                "id",
                "email",
                "nickname",
                "description",
                "tel",
                "profile",
                "type",
            ],
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

router.get('/:memberId', async(req, res, next) => {
    var id = req.params.memberId

    try{
        const user = await member.findOne({
            attributes: [
                "id",
                "email",
                "nickname",
                "description",
                "tel",
                "profile",
                "type",
            ],
            where : {
                id: id
            }
        });

        if(user){
            user.profile = imageLoad(user.profile)
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

router.get('/profile/:memberId', async(req, res, next) => {
    var id = req.params.memberId

    try {
        const result = await member.findOne({
            where: {
                id: id,
            }
        });

        const url = imageLoad(result.profile)

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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }

    // DB LOAD

});
router.get('/nickname/duplicate', isLoggedIn, async(req, res, next) => {
    let nickname = req.body.nickname;
    try{
        const result = await member.findOne({
            where: {
                nickname : nickname,
            }
        });

        if(result !== null){
            res.status(StatusCodes.OK).json({
                "message" : "duplicate",
            });
        }
        else{
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });

        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});

/*router.post('/certification', async(req, res, next) => {
    const { imp_uid } = req.body;
    console.log(imp_uid)

    try {
        // 인증 토큰 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: iamport.apikey,
                imp_secret: iamport.secret
            }
        })

        const { access_token } = getToken.data.response;

        // imp_uid로 인증 정보 조회
        const getCertifications = await axios({
            url: `https://api.iamport.kr/certifications/${imp_uid}`,
            method: 'get',
            headers: { 'Authorization': access_token }
        });
        //console.log(getCertifications.data)
        const certificationsInfo = getCertifications.data.response;
        //console.log(certificationsInfo)

        if(certificationsInfo){
            res.status(StatusCodes.OK).json({
                "certification" : certificationsInfo,
            });
        }
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
})*/

router.put('/', isLoggedIn, async (req, res, next) => {
    let id = req.user.id;
    let params = req.body;

    // patch로 변경필요
    try{
        const result = await member.update(
            params,
            {
                where : {
                    id : id,
                }
            });

        if(result){
            var ret = {
                "message" : "update completed!",
            }

            if ('type' in params && typeof params.type !== 'undefined') {
                const token = jwt.sign({
                    id: id,
                    type: params.type,
                }, secretKey, {
                    expiresIn: '12h',
                    issuer: 'ringu',
                });
                ret['token'] = token;
            }

            res.status(StatusCodes.OK).json(ret);
        }

    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
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
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
        else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                "error": "name update error",
            });
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
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});


module.exports = router;
