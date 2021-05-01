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
        const user = await member.findOne({ where: { email: _profile.email } });
        if(user){
            return done(null, user);
        }
        else{
            const user = await member.create({
                email: _profile.email,
            });
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