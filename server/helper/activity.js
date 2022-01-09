
module.exports = {
    checkLogin : (req, res, rurl) => {
        if (req.session) {
            if (req.session.sess_is_login == 1) {
                return true;
            }
        }
        res.redirect('/admin/login/?rurl=' + rurl);
        return false;
    }
};
