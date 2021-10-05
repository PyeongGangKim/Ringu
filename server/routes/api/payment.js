var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");

var iamport = require("../../config/iamport");
var axios = require('axios');

const { payment,sequelize, purchase, cart, book_detail, book, account, Sequelize: {Op} } = require("../../models");
const {kakaopay} = require("../../config/pay.js");
const url = require("../../config/url.js");
const request = require("request");
const { isLoggedIn } = require("../../middlewares/auth");


/*const { Iamporter, IamporterError } = require('iamporter');
const iamporter = new Iamporter({
    apiKey: iamport.apikey,
    secret: iamport.secret,
});*/

router.post('/', isLoggedIn, async(req, res, next) => {
    const t = await sequelize.transaction();

    try {
        var data = req.body
        var imp_uid = data.imp_uid
        var merchant_uid = data.merchant_uid

        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {
                imp_key: iamport.apikey,
                imp_secret: iamport.secret,
            }
        });

        const {access_token} = getToken.data.response;

        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`,
            method: "get",
            headers: { "Authorization": access_token }
        });
        const paymentData = getPaymentData.data.response


        if(Number(paymentData.amount) === Number(data.paid_amount)){
            const new_payment = await payment.create({
                //book_id:data.book_id,
                //book_detail_id:,
                member_id:      req.user.id,
                bank_name:      paymentData.bank_name,
                card_code:      paymentData.card_code,
                card_name:      paymentData.card_name,
                card_number:    paymentData.card_number,
                card_type:      paymentData.card_type,
                curreny:        paymentData.curreny,
                uid:            paymentData.imp_uid,
                merchant_uid:   paymentData.merchant_uid,
                paid_amount:    paymentData.amount,
                pay_method:     paymentData.pay_method,
                receipt_url:    paymentData.receipt_url,
                status:         paymentData.status,
                pg:             paymentData.pg_provider,
                buyer_name:     paymentData.buyer_name,
                buyer_tel:      paymentData.buyer_tel,
                buyer_email:    paymentData.buyer_email,
                buyer_addr:     paymentData.buyer_addr,
                buyer_postcode: paymentData.buyer_postcode,
                item_name:      paymentData.name,
                fail_reason:    paymentData.fail_reason,
                failed_at:      paymentData.failed_at,
            },
            {
                transaction: t
            })

            var bookDetailList = []
            for(var i=0; i < data.purchaseList.length; i++) {
                if("book_detail_id" in data.purchaseList[i] === false)
                    data.purchaseList[i]['book_detail_id'] = data.purchaseList[i]['id']

                delete data.purchaseList[i]['id']
                data.purchaseList[i]['payment_id'] = new_payment.id
                data.purchaseList[i]['member_id'] = req.user.id
                bookDetailList.push(data.purchaseList[i]['book_detail_id'])
            }
            let purchasedBookAuthorList = [];
            let purchasedBookPriceList = [];
            let purchasedBookChargeList = [];
            for(let bookDetailId of bookDetailList ){
                let purchasedBook = await book_detail.findOne({
                    attributes : [
                        "id",
                        "charge",
                        [sequelize.literal("book.price"), "price"],
                        [sequelize.literal("book.author_id"), "author_id"],
                    ],
                    where: {
                        id : bookDetailId,
                    },
                    include: [
                        {
                            model : book,
                            as : "book",
                            attributes: []
                        }
        
                    ],
                    transaction: t,
                });
                purchasedBookAuthorList.push(purchasedBook.dataValues.author_id);
                purchasedBookPriceList.push(purchasedBook.dataValues.price);
                purchasedBookChargeList.push(purchasedBook.dataValues.charge);
            }
            for(let i = 0 ; i < purchasedBookAuthorList.length ; i++){
                let earnedMoney =  purchasedBookPriceList[i] - (purchasedBookPriceList[i] * (purchasedBookChargeList[i] / 100));
                let [author_account, created] = await account.findOrCreate({
                    where : {
                        author_id : purchasedBookAuthorList[i],
                    },
                    defaults : {
                        author_id : purchasedBookAuthorList[i],
                        total_earned_money : earnedMoney,
                        total_withdrawal_amount: 0,
                        amount_available_withdrawal: earnedMoney
                    },
                    transaction : t,
                });
        
                if(!created){
                    let update_total_earned_money = Number(author_account.total_earned_money) + Number(earnedMoney);
                    let update_amount_available_withdrawal = Number(author_account.amount_available_withdrawal) + Number(earned_money);
                    await account.update({
                        total_earned_money: update_total_earned_money,
                        amount_available_withdrawal : update_amount_available_withdrawal,
                    },
                    {
                        where: {
                            id: author_account.id,
                        },
                        transaction: t,
                    });
                }
            }

            

            await purchase.bulkCreate(data.purchaseList,{transaction: t});

            await cart.update({
                status: 0,
            },
            {
                where: {
                    member_id: req.user.id,
                    book_detail_id: {
                        [Op.in] : bookDetailList,
                    },
                },
                transaction: t,
            })
            await t.commit();
            res.status(StatusCodes.OK).json({
                "message" : "OK"
            })
        }
    }
    catch(err) {
        console.log(err)
        await t.rollback();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "server error",
        });
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

module.exports = router;
