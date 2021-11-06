const { member } = require('../../models');

const getOption = (clientId, clientSecret, callbackURL) =>{
    const options = {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
    }
    return options;
}

const verify = async (accessToken, refreshToken, profile, done) => {
    if(!profile) return done(null, {message: "err"});
    let _profile = profile._json;
    if(!_profile.email) return done(null, {message: "email"});
    try{
        let user = await member.findOne({ where: { email: _profile.email, status: 1 } });
        if(user && user.google_id == null){
            return done(null, {message: "local sns"} );
        }
        if(user){
            user.isFirst = false;
            return done(null, user);
        }
        else{
            return done(null,{email: _profile.email, message: "first"});
        }
    }
    catch(err){
        console.error(err);
        done(err);
    }
}
module.exports = {
    getOption,
    verify
}