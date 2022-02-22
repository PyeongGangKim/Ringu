var express = require("express");
var router = express.Router();

const statusCodes = require("../../helper/statusCodes");

var iamport = require("../../config/iamport");
var axios = require('axios');
const logger = require('../../utils/winston_logger');
const { payment,sequelize, purchase, cart, book_detail, book, account, reward, reward_stat, Sequelize: {Op} } = require("../../models");
const {kakaopay} = require("../../config/pay.js");
const url = require("../../config/url.js");
const request = require("request");
const { isLoggedIn } = require("../../middlewares/auth");
const {reward_percent} = require("../../helper/reward_percent");


router.post('/', isLoggedIn, async(req, res, next) => {
    const t = await sequelize.transaction();
    
    try {
        var data = req.body
        var ids = data.ids

        delete data.ids

        var purchaseList = await book_detail.findAll({
            attributes: [
                'id',
                [sequelize.col('book.price'), 'price'],
            ],
            include: [
                {
                    model: book,
                    as: 'book',
                    attributes: []
                }
            ],
            where: {
                id: {
                    [Op.in]: ids.split(',')
                }
            },
            raw: true
        })

        params = {
            member_id:      req.user.id,
            pay_method:     data.PayMethod,
            mid:            data.MID,
            tid:            data.TID,
            paid_amount:    data.Amt,
            buyer_name:     data.name,
            item_name:      data.GoodsName,
            moid:           data.MOID,
            auth_date:      data.AuthDate,
            auth_code:      data.AuthCode,
            result_code:    data.ResultCode,
            result_msg:     data.ResultMsg,
            buyer_email:    data.BuyerEmail,
        }

        if(data.PayMethod === 'CARD') {
            params['fn_cd'] =       data.fn_cd
            params['fn_name'] =     data.fn_name
            params['acqu_cd'] =     data.AcquCardCode
            params['acqu_name'] =   data.AcquCardName
            params['quota'] =       data.CardQuota
        } 
        else if(data.PayMethod === 'BANK') {
            params['bank_cd'] =         data.BankCd
            params['bank_name'] =       data.BankName
            params['receipt_type'] =    data.ReceitType
            params['buyer_num'] =       data.BuyerAuthNum
        } 
        else {
            params['fn_cd'] =       data.fn_cd
            params['fn_name'] =     data.fn_name
            params['acqu_cd'] =     data.AcquCardCode
            params['acqu_name'] =   data.AcquCardName
            params['quota'] =       data.CardQuota
            params['epay_cl'] =     data.EPayCl
        }

        params['fail_reason'] =     data.ErrorMsg
        params['fail_code'] =       data.ErrorCode
        

        const new_payment = await payment.create(
            params
        ,
        {
            transaction: t
        })

        var bookDetailList = []
        
        for(var i=0; i < purchaseList.length; i++) {
            if("book_detail_id" in purchaseList[i] === false)                
                purchaseList[i]['book_detail_id'] = purchaseList[i]['id']

            delete purchaseList[i]['id']
            purchaseList[i]['payment_id'] = new_payment.id
            purchaseList[i]['member_id'] = req.user.id
            bookDetailList.push(purchaseList[i]['book_detail_id'])            
        }
        let purchasedBookAuthorList = [];
        let purchasedBookPriceList = [];
        let purchasedBookChargeList = [];
        let rewardValueList = [];
        let rewardAmount = 0;
        
        for(let bookDetailId of bookDetailList ){            
            let purchasedBook = await book_detail.findOne({
                attributes : [
                    "id",
                    [sequelize.literal("book.charge"), "charge"],
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
            let rewardValue = purchasedBook.dataValues.price * (reward_percent / 100);
            rewardValueList.push(rewardValue);
            rewardAmount += rewardValue;
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
                let update_amount_available_withdrawal = Number(author_account.amount_available_withdrawal) + Number(earnedMoney);
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

        for(let i = 0 ; i < rewardValueList.length ; i++){
            await reward.create({
                amount : rewardValueList[i],
                type: 1,
                member_id: req.user.id,
            },{
                transaction: t,
            });
        }        

        let [m_reward_statistics, created] = await reward_stat.findOrCreate({
            where : {
                member_id : req.user.id,
            },
            defaults : {
                member_id: req.user.id,
                amount: rewardAmount
            },
            transaction : t,
        });
        if(!created){
            let total_reward = Number(m_reward_statistics.amount) + Number(rewardAmount);
            
            await reward_stat.update({
                amount: total_reward,
            },
            {
                where: {
                    id: m_reward_statistics.id,
                },
                transaction: t,
            });
        }

        const duplicate = await purchase.findAll({
            where: {
                member_id: req.user.id,
                book_detail_id: {
                    [Op.in] : bookDetailList,
                },
                status: 1,
            }
        })

        if(duplicate.length > 0) {
            await t.rollback();
            res.status(statusCodes.BAD_REQUEST).json({
                "message"   : "already exists",
            })
            return;
        }

        await purchase.bulkCreate(purchaseList, {transaction: t});
        
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

        var fn;
        if(data.pay_method === 'CARD') 
            fn = data.fn_name
        else if(data.pay_method === 'BANK') 
            fn = data.BankName
        else 
            fn = data.EPayCl

        res.status(statusCodes.OK).json({
            "user"      : data.name,
            "fn"        : fn,
            "amount"    : data.Amt,
            "method"    : data.PayMethod,
        })
    }
    catch(err) {
        logger.error(err.stack);
        await t.rollback();
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
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
    request.post(options, async (err, response, body) => {
        if(err != null){
            console.error(err.stack);
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
                    res.status(statusCodes.OK).json({
                        "redirect_url" : response.body.next_redirect_pc_url,
                        "payment_id" : payment_id,
                    });
                }
                catch(err){
                    console.error(err.stack);
                    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
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
