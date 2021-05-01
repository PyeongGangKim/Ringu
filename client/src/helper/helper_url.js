module.exports = {
    api : {
        auth: {
            login:       "/auth/login",
            signup:      "/auth/signup",
            user: {
                get:     "/auth/user",
                edit:    "/auth/user/edit",
            },
            emailcode:   "/auth/email",

            eamilcheck:  "/auth/emailcheck",
            company: {
                get:     "/auth/company",
                edit:    "/auth/company/edit",
            }
        },
        member: {
            get:              "/member",
            verifyNickname:   "/member/name/duplicate",
        }
    },
    service : {
        home    : "/home",
        mypage  : {
            info        : "/mypage",
            purchases   : "/purchases",
            carts       : "/carts",
            fav_author  : "/favorite/author",
            fav_book    : "/favorite/book",
            auth        : "/auth",
            leave       : "/leave"
        },
        register : {
            author      : "/register/author"
        },
        buy : {
            buy         : "/buy",
            complete    : "/complete",
        },
        accounts: {
            login       : "/login",
            signup      : "/signup",
            signup_step : "/signup/step",

        }
    }
};
