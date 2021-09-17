module.exports = {
    api : {
        auth: {
            login:              "/auth/login",
            signup:             "/auth/signup",
            user: {
                get:            "/auth/user",
                edit:           "/auth/user/edit",
            },
            email: {
                code:           "/auth/email/code",
                duplicate:      "/auth/email/duplicate",
                identification: "/auth/email/identification",
            },
            company: {
                get:            "/auth/company",
                edit:           "/auth/company/edit",
            },
            sns:{
                naver_callback: "/auth/naver/callback",
                signup:         "/auth/signup/sns",
                naver:          "/auth/naver",
                kakao:          "/auth/kakao",
            },
            nickname_duplicate: "/auth/nickname/duplicate",

        },
        member: {
            get:                "/member",
            getById:            "/member/",
            nickname_duplicate: "/member/nickname/duplicate",
            password:           "/member/password",
            passwordCheck:      "/member/password/check",
            upload_profile:     "/member/upload_profile",
            profile:            "/member/profile/",
            certification:      "/member/certification",
            update:             "/member/",
            delete:             "/member",
        },
        cart: {
            create:             "/cart",
            duplicate:          "/cart/duplicate",
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
            modify:             "/book/modify",
            download:           "/book/download",
            preview:            "/book/preview",
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
                create:         "/favorite_author",
                get:            "/favorite_author/",
                list:           "/favorite_author",
                delete:         "/favorite_author/",
                duplicate:      "/favorite_author/duplicate",
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
            stats:              "/review/stats",
        },
        register: {
            book:               "/book",
            bookDetail:         "/book_detail"
        },
        notification: {
            getNotification:    "/notification/",
            getNewNoticount:    "/notification/newNotiCount",
            getBookNotification:     "/notification/book",
            getNormalNotification:  "/notification/notice",
            getWithdrawalNotification: "/notification/withdrawal",
            putReadNotification:    "/notification/",
            getBookNewNotiCount: "/notification/book/newNotiCnt",
            getWithdrawalNewNotiCount: "/notification/withdrawal/newNotiCnt",
            getNormalNewNotiCount: "/notification/notice/newNotiCnt",
        },
        payment: {
            create              :"/payment",
        },
    },
    service : {
        accounts: {
            login               : "/login",
            signup              : "/signup",
            signup_step         : "/signup/step",
            welcome             : "/welcome",
        },
        auth: {
            naver               : "/auth/callback/naver",
            kakao               : "/auth/callback/kakao",
            google              : "/auth/callback/google",
        },
        author                  : "/author/",
        book: {
            book                : "/book/",
            modify              : "/modify/book/",
        },
        buy : {
            buy                 : "/buy",
            complete            : "/complete",
        },
        home                    : "/home",
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
        notification    : "/notification/",
        search          : "/search",
        register : {
            author              : "/register/author",
            author_detail       : "/register/author/detail",
            book                : "/register/book/",
        },
        review          : "/review/",
    }
};
