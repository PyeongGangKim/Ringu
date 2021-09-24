const passport = require("passport");
const {StatusCodes} = require("http-status-codes");

exports.isLoggedIn = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (user) {
            req.user = user;
            next();
        }
        else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "login"
            });
        }
    })(req, res, next);
};

exports.isAuthor = (req, res, next) => {
    if(req.user.type){
        next();
    }
    else{
        res.status(StatusCodes.FORBIDDEN).json({
            "message": "author"
        });
    }
}
