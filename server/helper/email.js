var mailgun = require("../third_party/mailgun");

module.exports = {
    lost_password : (email, html) => {
        mailgun.send(email, "비밀번호 변경", html);
    }
};
