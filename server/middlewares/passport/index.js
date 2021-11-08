const passport = require('passport');
const bcrypt = require('bcrypt');
const { member } = require('../../models');
const { secretKey } = require('../../config/jwt_secret');
// strategy
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: NaverStrategy } = require('passport-naver');
const { ExtractJwt , Strategy: JWTStrategy } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy : KakaoStrategy } = require('passport-kakao');
const { Strategy : FacebookStrategy } = require('passport-facebook');
const { Strategy : CustomStrategy } = require('passport-custom');

//sns config
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = require('../../config/google_auth');
const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_CALLBACK_URL } = require('../../config/naver_auth');
const { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_CALLBACK_URL } = require('../../config/kakao_auth');
const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CALLBACK_URL } = require('../../config/facebook_auth');

const {getOption, verify} = require('./sns');
//local strategy
const localStrategyOption = {
    usernameField: "email",
    passwordField: "password",
};
async function localVerify(email, password, done) {
    try{
        const exMember = await member.findOne({
            where : {
                email: email,
                status: 1,
            }
        });
        if(exMember && exMember.password === null && (exMember.kakao_id !== null || exMember.naver_id !== null || exMember.google_id !== null || exMember.facebook_id !== null)) {
            done(null, false, {message: "SNS로 가입한 계정입니다."});
        }
        else if(exMember){
            const result = await bcrypt.compare(password, exMember.password);
            if(result){
                done(null, exMember);
            }
            else{
                done(null, false, {message: "비밀번호가 일치하지 않습니다."});
            }
        }
        else{
            done(null, false, {message: "가입되지 않은 회원입니다."});
        }

    }
    catch(err){
        console.error(err);
        done(err);
    }

};

// jwt strategy


const JWTStrategyOption = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
}
async function JWTVerify({id}, done) {
    try{
        const result = await member.findOne({ where : {id: id, status: 1} });
        if(!result){
            return done(null, false, '');
        }
        const {dataValues: user } = result;
        return done(null, user);
    }
    catch(err){
        return done(err);
    }
}

async function SNSVerify(req, done) {
    try{
        var {id, email, sns} = req.query;
        console.log(id, email, sns);
        const user = await member.findOne({ where : {email: email, status: 1} });

        if(user && user[`${sns}_id`] === id){
            console.log(user[`${sns}_id`], id);
            return done(null, user);
        }

        // email이 등록이 안 되어 있는 경우
        else {
            console.log("error");
            return done("error", user);
        }
    }
    catch(err){
        console.log(err);
        done(err);
    }
}

const facebookOptions = getOption(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CALLBACK_URL);
facebookOptions.profileFields = ['id','name','email'];

module.exports = () => {
    passport.use("local", new LocalStrategy(localStrategyOption, localVerify));
    passport.use("jwt", new JWTStrategy(JWTStrategyOption, JWTVerify));
    passport.use("google", new CustomStrategy(SNSVerify));
    //passport.use("naver", new NaverStrategy(getOption(NAVER_CLIENT_ID,NAVER_CLIENT_SECRET,NAVER_CALLBACK_URL), verify));
    passport.use("naver", new CustomStrategy(SNSVerify));
    passport.use("kakao", new CustomStrategy(SNSVerify));
    passport.use("facebook", new FacebookStrategy(facebookOptions, verify));
};
