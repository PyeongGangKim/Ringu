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
                code:           "/auth/email/code",
                duplicate:      "/auth/email/duplicate",
                identification: "/auth/email/identification",
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
            getById:          "/member/",
            verify_nickname:  "/member/nickname/duplicate",
            password:         "/member/password",
            passwordCheck:    "/member/password/check",
            upload_profile:   "/member/upload_profile",
            profile:          "/member/profile/",
            certification:    "/member/certification",
            update:           "/member/",
            delete:           "/member",
        },
        cart: {
            list:               "/cart",
            delete:             "/cart/",
            clear:              "/cart/clear",
        },
        purchase: {
            list:               "/purchase",
        },
        book: {
            get:                "/book/",
            list:               "/book",
            modify:             "/book/modify" ,
            dowload:            "/book/download",
            getDetailList:      "/book/detail/",
            main:               "/book/main",
            delete:             "/book/",
        },
        book_detail: {
            get:                "/book_detail/",
            delete:             "/book_detail/",
        },
        category: {
            list:               "/category",
        },
        author: {
            get:                "/author/",
        },
        favorite: {
            author: {
                get:            "/favorit_author/",
                list:           "/favorite_author",
                delete:         "/favorite_author/",
            },
            book: {
                create:         "/favorite_book",
                get:            "/favorite_book/",
                list:           "/favorite_book",
                delete:         "/favorite_book/",
                duplicate:      "/favorite_book/duplicate",
            },
        },
        review: {
            getReivewList:      "/review",
            getByMember:        "/review/member/",
            getByAuthor:        "/review/author/",
            getByBook:          "/review/book/",
            register:           "/review",
            duplicate:          "/review/duplicate",
        },
        register: {
            book:               "/book",
        },
        notification: {
            getNotification:    "/notification/",
            getNewNoticount:    "/notification/newNotiCount",
            getBookNotification:     "/notification/book",
            getNormalNotification:  "/notification/notice",
            getWithdrawalNotification: "/notification/withdrawal",
            putReadNotification:    "/notification/"
        },
        payment: {
            create:             "/payment",
        },
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
            register            : "/register/author/",
        },
        author                  : "/author/",
        register : {
            author              : "/register/author",
            author_detail       : "/register/author/detail",
            book                : "/register/book/",
        },
        book: {
            book                : "/book/",
            modify              : "/modify/book/",
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
        notification    : "/notification/",
    }
};
