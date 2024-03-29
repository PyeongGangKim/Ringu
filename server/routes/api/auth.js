var express = require("express");

let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
const { salt,salt_num } = require("../../config/salt");
const passport = require('passport');
const logger = require('../../utils/winston_logger');
const { smtpTransport } = require('../../config/email');
var { generateRandom } = require('../../utils/random_number');
const { secretKey } = require('../../config/jwt_secret');
const StatusCodes = require("../../helper/statusCodes");

const { sequelize, identification, member, auth, Sequelize: {Op} } = require("../../models");
const { isLoggedIn } = require('../../middlewares/auth');
const { redirect_url } = require('../../config/url');
const { ncp } = require("../../config/naver_sms");

let router = express.Router();
router.post("/signup", async (req, res, next) => {
    var payload = req.body;
    payload.password = payload.password.toString();

    try{
        let salt = await bcrypt.genSalt(parseInt(salt_num));
        let hashed_password = await bcrypt.hash(payload.password, salt);
        payload.password = hashed_password;

        let result = await member.create({
            email: payload.email,
            password: payload.password,
            nickname: payload.nickname,
            age_terms_agreement: payload.age_terms_agreement,
            service_terms_agreement: payload.service_terms_agreement,
            privacy_terms_agreement: payload.privacy_terms_agreement,
            notice_terms_agreement: payload.notice_terms_agreement,
            account_active_terms_agreement: payload.account_active_terms_agreement,
        });

        const token = jwt.sign({
            id: result.id,
            type: result.type,
            nickname: result.nickname,
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });

        res.status(StatusCodes.CREATED).json(
            {
                "token": token,
            });
    } catch(err) {
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error': 'signup fails'
        })
    }
});

router.post("/signup/sns", async (req, res, next) => {
    var payload = req.body;

    try{
        let user = {
            email: payload.email,
            nickname: payload.nickname,
            age_terms_agreement: payload.age_terms_agreement,
            service_terms_agreement: payload.service_terms_agreement,
            privacy_terms_agreement: payload.privacy_terms_agreement,
            notice_terms_agreement: payload.notice_terms_agreement,
            account_active_terms_agreement: payload.account_active_terms_agreement,
        }
        user[`${payload.sns}_id`] = payload.id;

        let result = await member.create(user);
        const token = jwt.sign({
            id: result.id,
            type: result.type,
            nickname: result.nickname,
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });

        res.status(StatusCodes.CREATED).json({
            token: token
        });
    } catch(err) {
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error':'signup fails'
        })
    }
});

router.get('/nickname/duplicate', async(req, res, next) => { // 회원 가입시 nickname 중복 체크.
    let nickname = req.query.nickname;

    try{
        const result = await member.findOne({
            where: {
                nickname : nickname,
                status: 1,
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
            });;
        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error':'duplicate check fails'
        })
    }
});

router.get('/email/duplicate', async(req, res, next) => {//email 중복체크하는 api
    var email = req.query.email;

    try{
        const result = await member.findOne({
            where : {
                email: email,
                status: 1,
            }
        });
        if(result !== null){
            res.status(StatusCodes.DUPLICATE).json({
                "message" : "duplicate"
            });
        }
        else {
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
	    console.log(err)
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error':'duplicate check fails'
        })
    }
})
//google login
router.get('/google', function(req, res, next){
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
      },function(err, user, info) {
        if(err){
            logger.error(err.stack);
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "unauthorized"
            });
        }
        else{
            if(info){
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "local sns"
                });
            }
            else{
                const token = jwt.sign({
                    id: user.id,
                    type: user.type,
                    nickname: user.nickname,
                }, secretKey, {
                    expiresIn: '12h',
                    issuer: 'ringu',
                });
                res.status(StatusCodes.OK).json({
                    token: token
                });
            }
        }

    })(req,res,next)
});

router.get( '/google/callback',passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),
    function (req, res) {
        const token = jwt.sign({
             id: req.user.id,
             type: req.user.type,
             nickname: req.user.nickname,
            }, secretKey, {
                expiresIn: '12h',
                issuer: 'ringu',
            });
        res.status(StatusCodes.CREATED).json(
            {
                'token' :  token
        }).redirect(redirect_url);
    },
);

//naver login
router.get('/naver', function(req, res, next) {
    passport.authenticate('naver', {
            session: false
    }, function(err, user, info) {
        if(err) {            
            logger.error(err.stack);
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "unauthorized"
            });
        }

        else {
            if(info) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "already exists"
                });
             }
             else{
                 const token = jwt.sign({
                     id: user.id,
                     type: user.type,
                     nickname: user.nickname,
                 }, secretKey, {
                     expiresIn: '12h',
                     issuer: 'ringu',
                 });
                 res.status(StatusCodes.OK).json({
                     token: token
                 });
             }
        }
    }) (req,res,next)
});

router.get('/naver/callback', function(req, res) {
    try {
        var token = req.query.token;
        var header = "Bearer " + token; // Bearer 다음에 공백 추가

        var api_url = 'https://openapi.naver.com/v1/nid/me';
        var request = require('request');
        var options = {
            url: api_url,
            headers: {'Authorization': header}
        }

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                res.end(body);
            } else {
                if(response != null) {
                    console.log('error = ' + response.statusCode);
                    res.status(response.statusCode).end(body);
                }
            }
        });
    } catch(err) {
        logger.error(err.stack);
        res.status(response.statusCode).end();
    }

})
//kakao login
router.get('/kakao', function(req, res, next) {
    passport.authenticate('kakao', {
            session: false
    }, function(err, user, info) {
        if(err) {            
            logger.error(err.stack);
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "unauthorized"
            });
        }

        else {
            if(info) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "already exists"
                });
             }
             else{
                 const token = jwt.sign({
                     id: user.id,
                     type: user.type,
                     nickname: user.nickname,
                 }, secretKey, {
                     expiresIn: '12h',
                     issuer: 'ringu',
                 });
                 res.status(StatusCodes.OK).json({
                     token: token
                 });
             }
        }
    }) (req,res,next)
});

router.get( '/kakao/callback',passport.authenticate('kakao', { failureRedirect: '/auth/login', session: false }),
  function (req, res) {
      const token = jwt.sign({
           id: req.user.id,
           type: req.user.type,
           nickname: req.user.nickname,
          }, secretKey, {
              expiresIn: '12h',
              issuer: 'ringu',
          });
      res.cookie('token', token).redirect(redirect_url);
  },
);

//facebook login
router.get('/facebook', passport.authenticate('facebook', {
    session: false,
    scope: ['public_profile','email'],
  }),
);

router.get( '/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/auth/login', session: false }),
  function (req, res) {
      const token = jwt.sign({
           id: req.user.id,
           type: req.user.type,
          }, secretKey, {
              expiresIn: '12h',
              issuer: 'ringu',
          });
      res.cookie('token', token).redirect(redirect_url);
  },
);

//local login
router.post("/login", async (req, res, next) => {
    try {
        passport.authenticate("local", { session: false },(passportError, user, info) => {
            if(passportError || !user){
                res.status(StatusCodes.BAD_REQUEST).json({message: info.message});
                return;
            }
            req.login(user, { session: false }, (loginError) => {
                if (loginError) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(loginError);
                    return;
                }
                const token = jwt.sign({
                    id: user.id,
                    type: user.type,
                    nickname: user.nickname,
                }, secretKey, {
                    expiresIn: '12h',
                    issuer: 'ringu',
                });
                res.status(StatusCodes.OK).json({
                    token: token
                });
            });
        })(req,res);
    }
    catch(err) {
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": err,
        })
    }
});

router.get('/logout', (req, res) => {
    res.send("User Logout");
    logger.info('User Logout Api')
})

router.get('/', isLoggedIn, function (req, res) {
    res.send({ authenticated: req.user !== undefined });
});

router.get('/email/identification', async(req, res, next) => { // email 인증번호 확인 api
    const number = req.query.number;
    const email = req.query.email;
    const curDay = new Date();

    let time = curDay.getHours() * 3600 + curDay.getMinutes() * 60 + curDay.getSeconds();

    try{
        const result = await identification.findOne({
            raw: true,
            attributes : [
                "id",
                ["identification_info","email"] ,
                "identification_number",
                "created_date_time",
            ],
            where: {
                identification_info : email,
                identification_number : number,
                status: 1,
                type: 1,
            }
        });

        if(result === null){
            res.status(StatusCodes.BAD_REQUEST).json({
                reason: "dismatch identification number",
            });
            return;
        }

        const savedTime = result.created_date_time;
        let timeToCmp = savedTime.getHours() * 3600 + savedTime.getMinutes() * 60 + savedTime.getSeconds();
        if(time - timeToCmp > 300){
            await identification.update(
                {
                    status : 0,
                },
                {
                    where : {
                        identification_info : email,
                        identification_number : number,
                    }
                }
            );
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                reason: "time over",
            });
            return;
        }

        res.status(StatusCodes.OK).send();
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error'
        });
    }
})

router.post('/email/code', async (req, res, next) => {//email 인증번호 보내는 api
    const number = generateRandom(111111,999999);
    const email = req.body.email;

    const mailOptions = {
        from: "trop100@naver.com",
        to: email,
        subject: "[RINGU]인증 관련 이메일 입니다",
        text: "오른쪽 숫자 6자리를 입력해주세요 : " + number
    };
    try{
        await smtpTransport.sendMail(mailOptions, (error, response) => {
            if(error){
                res.json({status: 'error', reason: 'email auth fail'});
                return;
            }
            smtpTransport.close();
        });
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err});
    }
    try{
        await identification.create({
            identification_info : email,
            identification_number : number,
            type: 1,
        });
        res.status(StatusCodes.CREATED).json({
            message: "send number to email"
        });
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "server error",
        });
    }
});

router.post('/email/change_pwd', async (req, res, next) => {//비밀번호 변경 주소 메일 전송    
    const email = req.body.email;
    
    try{
        const user = await member.findOne({
            where : {
                email: email,
                status: 1,
            }
        })

        if(!user) {
            res.status(StatusCodes.OK).json({
                message: "not found"
            });
            return;
        }
    
        if(!!user.naver_id) {
            res.status(StatusCodes.OK).json({
                message: "naver"
            });
            return;
        }
    
        if(!!user.kakao_id) {
            res.status(StatusCodes.OK).json({
                message: "kakao"
            });
            return;
        }
    
        if(!!user.google_id) {
            res.status(StatusCodes.OK).json({
                message: "google"
            });
            return;
        }   
    
        const token = require('crypto').randomBytes(24).toString('hex');
        const data = {
            token,
            member_id: user.id,
            ttl: 1000,
        }
        
        const Auth = await auth.findOne({
            where : {
                member_id: user.id
            }
        })
        if(!Auth) {
            await auth.create(data)
        }
        else {
            data['created_date_time'] = new Date()            
            await auth.update(data, {
                where:{id:Auth.id}
            });
        }
    
        const mailOptions = {
            from: "trop100@naver.com",
            to: email,
            subject: "[RINGU] 비밀번호 변경 이메일입니다",
            text: 
                "아래의 URL을 클릭하시면 비밀번호 변경 페이지로 연결됩니다.\n\n" +
                `https://ringu.me/change_pwd?token=${token}`
            
        };

        await smtpTransport.sendMail(mailOptions, (error, response) => {
            if(error){
                res.json({status: 'error', reason: 'email auth fail'});
                return;
            }
            smtpTransport.close();
        });
        
        res.status(StatusCodes.CREATED).send()
    }
    catch(err){
        logger.error(err.stack);
	    console.log(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err});
    }    
});

router.post('/validate_token', async (req, res, next) => {//비밀번호 변경 토큰 유효성 검사
    const token = req.body.token;
    
    try{
        const Auth = await auth.findOne({
            where : {
                token: token,
                created_date_time: {
                    [Op.gt]: sequelize.literal("NOW() - ttl")
                }
            }
        })

        if(!Auth) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "invalid"
            });
            return;
        }
        
        res.status(StatusCodes.OK).json({
            message: "valid"
        });
        return
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err});
    }    
});

router.put('/reset_password/', async (req, res, next) => {
    try{
        const result = await auth.findOne({
            where: {
                token: req.body.token
            }
        })

        if(!!result) {
            const user = await member.findOne({
                where: {
                    id: result.member_id
                }
            })

            if(!!user) {
                var _salt = await bcrypt.genSalt(salt);
                var password = await bcrypt.hash(req.body.password, _salt);

                await member.update({
                    password: password
                },{
                    where: {
                        id: user.id
                    }
                })

                res.status(StatusCodes.OK).json({
                    message: "ok"
                })
                return;
            }
        }

        res.status(StatusCodes.OK).json({
            message: "x"
        })
        return;
    }
    catch(err){
        console.log(err)
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }

    // DB LOAD

});

router.post('/phone/identification/number', isLoggedIn, async (req, res, next) => {
    const toPhoneNumber = req.body.phoneNumber;
    const number = generateRandom(111111,999999);
    const msg = "[RINGU] 인증번호 [" + number + "]를 입력해주세요.";
    try{
        const result = await ncp.sendSMS({
            to : toPhoneNumber,
            content: msg,
        });
        if(result.status == 200 || result.status == 202){
            await identification.create({
                identification_info : toPhoneNumber,
                identification_number : number,
                type: 2,
            });
            res.status(result.status);
        }
        else{
            res.status(result.status).json(result.msg);
        }
    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "server error",
        });;
    }
});

router.get('/phone/identification', isLoggedIn ,async(req, res, next) => { // phone 인증번호 확인 api
    const number = req.query.number;
    const phone = req.query.phoneNumber;
    const curDay = new Date();

    let time = curDay.getHours() * 3600 + curDay.getMinutes() * 60 + curDay.getSeconds();

    try{
        const result = await identification.findOne({
            raw: true,
            attributes : [
                "id",
                ["identification_info","phone"] ,
                "identification_number",
                "created_date_time",
            ],
            where: {
                identification_info : phone,
                identification_number : number,
                status: 1,
                type: 2,
            }
        });
        if(result == null){
            res.status(StatusCodes.NOT_ACCEPTABLE).json({
                reason: "dismatch identification number",
            });
            return;
        }
        const savedTime = result.created_date_time;
        let timeToCmp = savedTime.getHours() * 3600 + savedTime.getMinutes() * 60 + savedTime.getSeconds();
        await identification.update(
            { status : 0,},
            {
                where : {
                    identification_info : phone,
                    identification_number : number,
                }
            }
        );
        if(time - timeToCmp > 300){
            res.status(StatusCodes.REQUEST_TIMEOUT).json({
                reason: "time over",
            });
        }
        else{
            res.status(StatusCodes.OK).json({
                "message": "OK",
            });
        }

    }
    catch(err){
        logger.error(err.stack);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "server error",
        });;
    }
});


module.exports = router;
