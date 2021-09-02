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
    if(!profile) return done('err', null);
    var _profile = profile._json;
    try{
        let user = await member.findOne({ where: { email: _profile.email, status: 1 } });
        if(user){
            user.isFirst = false;
            return done(null, user);
        }
        else{
            user = await member.create({
                email: _profile.email,
            });
            user.isFirst = true;
            return done(null,user);
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