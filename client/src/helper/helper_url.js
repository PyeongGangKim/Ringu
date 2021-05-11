module.exports = {
    api : {
        auth: {
            login:          "/auth/login",
            signup:         "/auth/signup",
            user: {
                get:        "/auth/user",
                edit:       "/auth/user/edit",
            },
            email: {
                code:       "/auth/email/code",
                duplicate:  "/auth/email/duplicate",
            },
            company: {
                get:        "/auth/company",
                edit:       "/auth/company/edit",
            },
            sns:{
                naver:      "/auth/naver",
            }
        },
        member: {
            get:              "/member",
            verifyNickname:   "/member/name/duplicate",
            password:         "/member/password",
            passwordCheck:    "/member/password/check",
        }
    },
    service : {
        home    : "/home",
        mypage  : {
            info            : "/mypage",
            password_change : "/mypage/password/change",
            leave           : "/leave",
            purchases       : "/purchases",
            carts           : "/carts",
            fav_author      : "/favorite/author",
            fav_book        : "/favorite/book",
            auth            : "/auth",
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
        },
        auth: {
            naver       : "/auth/callback/naver",
            kakao       : "/auth/callback/kakao",
            google      : "/auth/callback/google",
        },
    }
};
