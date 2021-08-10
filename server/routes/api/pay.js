var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { isLoggedIn, isAuthor } = require("../../middlewares/auth");


const {book_detail, sequelize, member, purchase, book, review, review_statistics, Sequelize : {Op}} = require("../../models");
const {imageLoad} = require("../../middlewares/third_party/aws.js");
const {kakaopay} = require("../../config/pay.js");
const url = require("../../config/url.js");
const request = require("request");

router.post('/kakaopay', /*isLoggedIn,*/ async(req, res, next) => {
    let cid = kakaopay.cid;
    let partner_order_id = 2; // timestamp + user nickname//merchant_uid로 같이 저장
    let partner_user_id = req.user.id; // 테이블에 저장
    let item_name = req.body.item_name; // Item_name 아임포트에는 그냥 새로운거 추가
    let quantity = req.body.quantity; // 새로운 테이블 추가
    let amount = req.body.amount; // paid_amount column에 저장
    let tax_free_amount = 0; // 이것도 따로 저장.
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
    console.log(options);
    request.post(options, function(err, response, body){
        if(err != null){
            console.error(err);
        }
        else{
            if(response.statusCode == 200){
                console.log(response.body.tid); // 저장 필요
                console.log(response.body.next_redirect_pc_url);
                res.status(StatusCodes.OK).json({
                    redirect_url : response.body.next_redirect_pc_url,
                });
            }
            else{
                console.error(response.body);
            }
        }
        
        
    })
});

module.exports = router;