var express = require("express");
var router = express.Router();
var axios = require('axios');
var iamport = require("../../config/iamport");

let jwt = require('jsonwebtoken');
const { secretKey } = require('../../config/jwt_secret');

const bcrypt = require('bcrypt');

const logger = require('../../utils/winston_logger');

let {makeNewPassowrd} = require("../../helper/makeNewPassword");


const StatusCodes = require("../../helper/statusCodes");

let { member } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");
const { uploadFile } = require("../../middlewares/third_party/aws");
const { salt,salt_num } = require("../../config/salt");
const { getImgURL } = require("../../utils/aws");
const { smtpTransport } = require("../../config/email");

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
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error" : "server error"
        });
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
            if(user.profile)
            {
                user.profile = getImgURL(user.profile)
            }
            res.status(StatusCodes.OK).json({
                user: user,
            })
        }
        else {
            res.status(StatusCodes.NO_CONTENT).json({
                "message" : "NO content"
            });
        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error" : "server error"
        });
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
        var url;
        if(result.profile) {
            url = getImgURL(result.profile);
        }
        res.status(StatusCodes.OK).json({
            "url" : url,
        });
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error" : "server error"
        });
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
        logger.error(err.stack);
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
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }

    // DB LOAD

});
router.get('/nickname/duplicate', isLoggedIn, async(req, res, next) => {
    let nickname = req.query.nickname;
    try{
        const result = await member.findOne({
            where: {
                nickname : nickname,
            }
        });

        if(result !== null){
            res.status(StatusCodes.DUPLICATE).json({
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
        logger.error(err.stack);
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
        logger.error(err);
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
        logger.error(err.stack);
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
            res.status(StatusCodes.NO_CONTENT).json({
                "message": "No content",
            });
        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "name update error",
        });
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
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});
router.put('/:email/newPassword', async(req,res,next) =>{
    let newPwd = makeNewPassowrd(8);
    let email = req.params.email;
    let salt = await bcrypt.genSalt(parseInt(salt_num));
    let hashed_password = await bcrypt.hash(newPwd, salt);
    const mailOptions = {
        from: "ringu9999@gmail.com",
        to: email,
        subject: "[RINGU] 초기화된 비밀번호 입니다.",
        text: "초기화된 비밀 번호 입니다." + newPwd + "\n 보안을 위해 비밀번호를 재설정 해주십시오",
    }
    try{
        let chagneMember = await member.findOne({
            where: {
                email: email,
                status : 1,
            }
        });
        if(!chagneMember){
            res.status(StatusCodes.NO_CONTENT).json({
                "message" : "등록된 email이 없습니다."
            })
        }
        else{
            if(chagneMember.kakao_id !== null || chagneMember.naver_id !== null || chagneMember.google_id !== null || chagneMember.facebook_id !== null){
                res.status(StatusCodes.OK).json({
                    "message": "sns"
                });
            }
            else{
                await member.update({
                    password: hashed_password
                },
                {
                    where: {
                        email: email
                    }
                });
                await smtpTransport.sendMail(mailOptions, (error, response) => {
                    if(error){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            "message" : "email auth fail"
                        });
                    }
                    smtpTransport.close();
                });
                res.status(StatusCodes.OK).json({
                    "message": "OK"
                });
            }

        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }

})


module.exports = router;
