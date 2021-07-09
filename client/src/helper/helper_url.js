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
                naver_callback: "/auth/naver/callback",
                signup:         "/auth/signup/sns",
                naver:          "/auth/naver",
                kakao:          "/auth/kakao",
            },
            verify_nickname:  "/auth/nickname/duplicate",
        },
        member: {
            get:              "/member",
            verify_nickname:  "/member/nickname/duplicate",
            password:         "/member/password",
            passwordCheck:    "/member/password/check",
            upload_profile:   "/member/upload_profile",
        },
        cart: {
            list:               "/cart",
            delete:             "/cart/",
        },
        purchase: {
            list:               "/purchase",
        },

        book: {
            get:                "/book/",
            list:               "/book",
            dowload:            "/book/download",
            getByDetail:        "/book/detail/",

        },
        author: {
            get:                "/author/",
        },
        favorite: {
            author: {
                list:           "/favorite_author",
                delete:         "/favorite_author/",
            },
            book: {
                list:           "/favorite_book",
                delete:         "/favorite_book/",
            },
        },
        review: {
            getReivewList:      "/review",
            getByMember:        "/review/member/",
            getByAuthor:        "/review/author/",
            getByBook:          "/review/book/",
            register:           "/review",
        }
    },
    service : {
        home    : "/home",
        mypage  : {
            info                : "/mypage",
            password_change     : "/mypage/password/update",
            notification_change : "/mypage/notification/update",
            leave               : "/leave",
            purchases           : "/purchases",
            carts               : "/carts",
            fav_author          : "/favorite/author",
            fav_book            : "/favorite/book",
            auth                : "/auth",
        },
        author                  : "/author/",
        register : {
            author      : "/register/author",
        },
        buy : {
            buy         : "/buy",
            complete    : "/complete",
        },
        accounts: {
            login       : "/login",
            signup      : "/signup",
            signup_step : "/signup/step",
            welcome     : "/welcome",
        },
        auth: {
            naver       : "/auth/callback/naver",
            kakao       : "/auth/callback/kakao",
            google      : "/auth/callback/google",
        },
        search          : "/search",
        review          : "/review/",
    }
};
