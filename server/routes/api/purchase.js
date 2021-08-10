var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { isLoggedIn, isAuthor } = require("../../middlewares/auth");


const {book_detail, sequelize, member, purchase, book, review, review_statistics, Sequelize : {Op}} = require("../../models");
const {imageLoad} = require("../../middlewares/third_party/aws.js");
const {kakaopay} = require("../../config/pay.js");
const url = require("../../config/url.js");
const request = require("request");



router.post('/' ,isLoggedIn, async (req, res, next) => { // 구매 생성 api
    let member_id = req.user.id;
    let book_detail_id = req.body.book_detail_id;
    let price = req.body.price;
    try{
        const result = await purchase.create({
            member_id : member_id,
            book_detail_id : book_detail_id,
            price: price,
        })
        console.log(result);
        res.status(StatusCodes.OK).send("success purchasing");

    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.post('/kakaopay', isLoggedIn, async(req, res, next) => {
    let cid = kakaopay.cid;
    let partner_order_id = 1;
    let partner_user_id = req.user.id;
    let item_name = req.body.item_name;
    let quantity = req.body.quantity;
    let amount = req.body.amount;
    let tax_free_amount = 0;
    let approval_url = url.home;
    let cancel_url = url.home;
    let fail_url = url.home;
    const options = {
        uri: "https://kapi.kakao.com/v1/payment/ready",
        method : "POST",
        host : "kapi.kakao.com",
        form : {
            cid : cid,
            partner_order_id : partner_order_id,
            partner_user_id : partner_user_id,
            item_name : item_name,
            quantity : quantity,
            total_amount : amount,
            tax_free_amount : tax_free_amount,
            approval_url : approval_url,
            cancel_url : cancel_url,
            fail_url: fail_url,
        },
        headers: {
            Authorization: "KakaoAK " + kakaopay.adminkey,
            //'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"
        },
        json: true,
    };
    request.post(options, function(err, response, body){
        if(err == null){
            console.error(err);
        }
        else{
            if(response.statusCode == 200){
                console.log(response.body.tid); // 저장 필요
                res.redirect(response.body.next_redirect_pc_url);
            }
            else{
                console.error(response.body);
            }
        }
        
        
    })
})
router.post('/duplicate' ,isLoggedIn, async (req, res, next) => { // duplicate 체크
    
    let member_id = req.body.member_id;
    let book_detail_id = req.body.book_detail_id;

    try{
        const duplicate_result = await purchase.findOne({
            where : {
                member_id : member_id,
                book_detail_id : book_detail_id,
                status: 1,
            }
        });
        if(duplicate_result){
            res.status(StatusCodes.CONFLICT).send("Duplicate");
        }
        else{
            res.status(StatusCodes.OK).send("No Duplicate");
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.post('/many' , isLoggedIn, async (req, res, next) => { // 모두 구매
    try{
        let purchaseList = req.body.purchaseList;
        const result = await purchase.bulkCreate(
            purchaseList,
        );
        console.log(result);
        res.status(StatusCodes.OK).send("success purchasing");
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});

router.get('/', isLoggedIn, async (req, res, next) => {// 구매한 리스트 가져오기
    var member_id = req.user.id;

    try{
        const purchaseList = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                [sequelize.literal("book_detail.id"), "book_detail_id"],
                [sequelize.literal("book_detail.title"), "subtitle"],
                [sequelize.literal("book_detail.file"), "file"],

                [sequelize.literal("`book_detail->book`.title"), "title"],
                [sequelize.literal("`book_detail->book`.price"), "price"],
                [sequelize.literal("`book_detail->book`.type"), "type"],

                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],

                [sequelize.literal("`book_detail->reviews`.id"), "review"],
                [sequelize.literal("`book_detail->book`.img"), "img"],
                [sequelize.literal("`book_detail->review_statistics`.score_amount / `book_detail->review_statistics`.person_number"),"review_score"],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : 'book_detail',
                    attributes: [
                        /*
                        "id",
                        "title",
                        "file",*/
                    ],
                    include: [
                        {
                            model: book,
                            as : 'book',
                            attributes : [
                                /*
                                "title",
                                "price",
                                "type",*/
                            ],
                            include : [
                                {
                                    model: member,
                                    as: 'author',
                                    attributes: [
                                        /*
                                        "nickname",*/
                                    ],
                                }
                            ]
                        },
                        {   //review가 필요한가?
                            model: review,
                            as : "reviews",
                            attributes: [
                                /*
                                "id",*/
                            ],
                            required: false,
                            where: {
                                member_id: member_id,
                            },
                        },
                        {
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [
                                /*
                                "score_amount",
                                "person_number",*/
                            ],
                        }
                    ]
                },
            ]
        });

        if(purchaseList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");
        }
        else{
            for(let i = 0 ; i < purchaseList.length ; i++){
                console.log(purchaseList[i].dataValues.img);
                if(purchaseList[i].dataValues.img== null || purchaseList[i].dataValues.img[0] == 'h') continue;
                purchaseList[i].dataValues.img = await imageLoad(purchaseList[i].dataValues.img);
            }
            res.status(StatusCodes.OK).json({
                purchaseList : purchaseList,
            });
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.get('/sellingList', isLoggedIn, isAuthor,async (req, res, next) => { //작가 입장에서 판 책들 가져오기
    var author_id = req.query.author_id;
    try{
        const selling_list = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                "price",
                [sequelize.literal("book_detail.title"), "title"],
                [sequelize.literal("member.name"), "buyer_name"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {author_id: author_id},
                            attributes: [],
                        }
                    ]
                },
                {
                    model : member,
                    as: "member",
                    attributes : [],
                }
            ],
        });
        if(selling_list.length == 0){
            console.log(selling_list);
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            console.log(selling_list);
            res.status(StatusCodes.OK).json({
                selling_list : selling_list,
            });
        }

    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});


router.delete('/:purchaseId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯


    var id = req.params.purchaseId;

    try{
        await purchase.destroy({
            where : {
                id : id,
            }
        })
        res.status(StatusCodes.OK);

    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
