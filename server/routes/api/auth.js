var express = require("express");
var router = express.Router();
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
const salt_num = require('../../config/salt');
const passport = require('passport');
const { smtpTransport } = require('../../config/email');
var { generateRandom } = require('../../utils/random_number');
const { secretKey } = require('../../config/jwt_secret');
const {StatusCodes} = require("http-status-codes");
const { identification, member } = require("../../models");
const { isLoggedIn } = require('../../middlewares/auth');
const { redirect_url } = require('../../config/url');
const { ncp } = require("../../config/naver_sms");

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
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });

        res.status(StatusCodes.CREATED).json(
            {
                "token": token,
            });
    } catch(err) {
        console.error(err);
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
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });

        res.status(StatusCodes.CREATED).json({
            token: token
        });
    } catch(err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error':'signup fails'
        })
    }
});

router.post('/nickname/duplicate', async(req, res, next) => { // 회원 가입시 nickname 중복 체크.
    let nickname = req.body.nickname;

    try{
        const result = await member.findAll({
            where: {
                nickname : nickname,
            }
        });
        if(result.length != 0){
            res.status(StatusCodes.CONFLICT).json({
                "message" : "Duplicate",
            });
        }
        else{
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });;
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error':'duplicate check fails'
        })
    }
});

router.get('/email/duplicate', async(req, res, next) => {//email duplicate체크하는 api
    var email = req.query.email;

    try{
        const result = await member.findOne({
            where : {
                email: email
            }
        });
        console.log(result);
        if(result){
            res.status(StatusCodes.CONFLICT).json({
                "message" : "Duplicate",
            });
        }
        else {
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            'error':'duplicate check fails'
        })
    }
})
//google login
router.get('/google', passport.authenticate('google', {
      session: false,
      scope: ['profile', 'email'],
    }),
);

router.get( '/google/callback',passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),
    function (req, res) {
        const token = jwt.sign({
             id: req.user.id,
             type: req.user.type,
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
router.get('/naver', passport.authenticate('naver', {session: false}),
    function(req, res) {
        console.log('naver')
        const token = jwt.sign({
            id: req.user.id,
            type: req.user.type,
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });

        res.status(StatusCodes.OK).json({
            token: token
        });
    }
)



/*router.get( '/naver/callback',passport.authenticate('naver', { failureRedirect: '/auth/login', session: false }),
  function (req, res) {
      const token = jwt.sign({
           id: req.user.id
          }, secretKey, {
              expiresIn: '12h',
              issuer: 'ringu',
          });
      res.cookie('token', token).redirect(redirect_url);
  },
);*/

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
        console.log(err);
        res.status(response.statusCode).end();
    }

})
//kakao login
router.get('/kakao', passport.authenticate('kakao', {
    session: false,
    scope: ['account_email'],
  }),
);

router.get( '/kakao/callback',passport.authenticate('kakao', { failureRedirect: '/auth/login', session: false }),
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
                res.status(400).json({message: info.message});
                return;
            }
            req.login(user, { session: false }, (loginError) => {
                if (loginError) {
                    res.status(400).json(loginError);
                    return;
                }
                const token = jwt.sign({
                    id: user.id,
                    type: user.type,
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
        console.log(err)
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
    console.log(222222)
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

        if(result == null){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
        res.json({status: 'error'});
    }
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
        console.log(result);
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
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});


module.exports = router;
