const passport = require("passport");

exports.isLoggedIn = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      req.user = user;
      next();
    } 
    else {
      res.status(403).send("로그인 필요");
    }
  })(req, res, next);
};
exports.isAuthor = (req, res, next) => {
    if(req.user.type){
        next();
    }
    else{
        res.status(403).send("작가 등록 필요");
    }
}