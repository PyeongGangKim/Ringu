var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");

var iamport = require("../../config/iamport");

const { payment,sequelize, purchase, Sequelize: {Op} } = require("../../models");
const {kakaopay} = require("../../config/pay.js");
const url = require("../../config/url.js");
const request = require("request");

const { Iamporter, IamporterError } = require('iamporter');
const iamporter = new Iamporter({
    apiKey: iamport.apikey,
    secret: iamport.secret,
});

router.post('/', isLoggedIn, async(req, res, next) => {
    try {
        var data = req.body

        const impData = async iamporter.findByImpUid(data.imp_uid);
        var impUid = impData.data.imp_uid;
        if (data.imp_uid !== impUid || (Number(data.paid_amount) !== Number(impData.data.amount))) {
            return res.json({status: 'error', reason: "IMPUID_NOT_MATCH"})
        }

        const existUid = await payment.findOne({
            where: {
                id: existUid
            }
        });

        if (existUid.length !== 0) {
            return res.json({status: 'error', reason: "IMPUID_EXIST"})
        }

        const new_payment = await payment.create({
            // TODO
        })


    }
    catch(err) {
        res.json({ status: 'error' });
    }
})

router.post('/kakaopay', /*isLoggedIn,*/ async(req, res, next) => {
    let cid = kakaopay.cid;
    let book_id = req.body.book_id;
    let book_detail_id = req.body.book_detail_id;
    let partner_order_id = Date.now().toString() + req.user.nickname; // timestamp + user nickname//merchant_uid로 같이 저장
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
    request.post(options, async (err, response, body) => {
        if(err != null){
            console.error(err);
        }
        else{
            if(response.statusCode == 200){
                console.log(response.body.tid); // 저장 필요
                let tid = response.body.tid;
                try{
                    const payment_ret = await payment.create({
                        member_id : partner_user_id,
                        book_id : book_id,
                        book_detail_id : book_detail_id,
                        item_name: item_name,
                        merchant_uid : partner_order_id,
                        status: 1,
                        card_name: "kakaopay",
                        uid: tid,
                        quantity: quantity,
                        paid_amount: amount,
                        tax_free_amount: tax_free_amount,
                    });
                    let payment_id = payment_ret.id;
                    res.status(StatusCodes.OK).json({
                        "redirect_url" : response.body.next_redirect_pc_url,
                        "payment_id" : payment_id,
                    });
                }
                catch(err){
                    console.error(err);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        "message" : "server error",
                    })
                }

                
            }
            else{
                console.error(response.body);
            }
        }
    })
});
