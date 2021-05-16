var express = require("express");
var router = express.Router();
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
const salt_num = require('../../config/salt');
const passport = require('passport');
const { smtpTransport } = require('../../config/email');
var { generateRandom } = require('../../utils/random_number');
const { secretKey } = require('../../config/jwt_secret');

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
            nicknmae: payload.nickname,
            age_terms_agreement: payload.age_terms_agreement,
            service_terms_agreement: payload.service_terms_agreement,
            privacy_terms_agreement: payload.privacy_terms_agreement,
            notice_terms_agreement: payload.notice_terms_agreement,
            account_active_terms_agreement: payload.account_active_terms_agreement,
        });
        const token = jwt.sign({
            id: result.id
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });
        res.status(200).json(token);
    } catch(err) {
        console.error(err);
        res.json({status:'error', reason:'signup fails'})
    }
});

router.post('/nickname/duplicate', isLoggedIn, async(req, res, next) => { // 회원 가입시 nickname 중복 체크.
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

router.get('/email/duplicate', async(req, res, next) => {//email duplicate체크하는 api
    var email = req.query.email;

    try{
        const result = await member.findOne({
            where : {
                email: email
            }
        });

        if(result){
            res.json({status: 'error', reason: 'duplicate email'});
            return;
        } else {
            res.json({status: 'ok'});
            return;
        }
    }
    catch(err){
        console.log(err);
        res.json({
            status: 'error'
        });
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
             id: req.user.id
            }, secretKey, {
                expiresIn: '12h',
                issuer: 'ringu',
            });
        res.cookie('token', token).redirect(redirect_url);
    },
);

//naver login
router.get('/naver', passport.authenticate('naver', {session: false}),
    function(req, res) {
        const token = jwt.sign({
            id: req.user.id
        }, secretKey, {
            expiresIn: '12h',
            issuer: 'ringu',
        });

        res.status(200).json({token: token});
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
           id: req.user.id
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
           id: req.user.id
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
                    id: user.id
                }, secretKey, {
                    expiresIn: '12h',
                    issuer: 'ringu',
                });
                res.json({status:"ok", token: token});
            });
        })(req,res);
    }
    catch(err) {
        console.log(err)
        res.json({status:"error", error:err, reason:"login fail"})
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
        if(result == null){
            res.json({
                status: "error",
                reason: "dismatch identification number",
            });
            return;
        }
        const savedTime = result.created_date_time;
        let timeToCmp = savedTime.getHours() * 3600 + savedTime.getMinutes() * 60 + savedTime.getSeconds();
        if(time - timeToCmp > 300){
            await identification.update(
                { status : 0,},
                {
                    where : {
                        identification_info : email,
                        identification_number : number,
                    }
                }
            );
            res.json({
                status: "error",
                reason: "time over",
            });
            return;
        }
        res.json({
            status: "ok",
            message: "correct",
        });

    }
    catch(err){
        console.log(err);
        res.json({status: 'error'});
    }
})

router.post('/email/code', async (req, res, next) => {//email 인증번호 보내는 api
    const number = generateRandom(111111,999999);
    const email = req.body.email;

    const mailOptions = {
        from: "RINGU",
        to: email,
        subject: "[RINGU]인증 관련 이메일 입니다",
        text: "오른쪽 숫자 6자리를 입력해주세요 : " + number
    };
    try{
        await smtpTransport.sendMail(mailOptions, (error, resposne) => {
            if(error){
                console.log(error)
                res.json({status: 'error', reason: 'email auth fail'});
                return;
            }
            smtpTransport.close();
        });
    }
    catch(err){
        console.log(err);
        res.json({status: 'error'});
    }
    try{
        await identification.create({
            identification_info : email,
            identification_number : number,
            type: 1,
        });
        res.json({status: "ok", message: "send number to email"});
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
            res.json({status: "ok", message: "send number to phone"});
        }
        else{
            res.json({status: "error", reason: "fail to send msg"});
        }
    }
    catch(err){
        console.error(err);
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
            res.json({
                status: "error",
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
            res.json({
                status: "error",
                reason: "time over",
            });
        }
        else{
            res.json({
                status: "ok",
                message: "correct",
            });
        }

    }
    catch(err){
        console.log(err);
        res.json({status: 'error'});
    }
});


module.exports = router;
