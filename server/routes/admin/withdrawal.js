var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");

const { checkLogin } = require("../../helper/activity");



const { member, author ,withdrawal,notification, notiCount, account, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");

router.get("/", async (req, res, next) => {
    
    checkLogin(req, res, "/admin/account");

    
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "ASC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "name"         : ("name" in req.query) ? req.query.title : "",
        "nickname"         : ("nicknmae" in req.query) ? req.query.price : "",
        "is_remittance" : req.query.is_remittance,
    }

    try{
        const {count, rows} = await withdrawal.findAndCountAll({
            where: {
                [Op.and] : {
                    '$author.author.name$' : (fields.name != "") ?{ [Op.like]: "%"+fields.name+"%" } : {[Op.like] : "%%" } ,
                    '$author.nickname$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.nickname+"%" } : {[Op.like] : "%%" } ,
                    is_remittance : fields.is_remittance,
                },
            },
            limit : limit,
            offset : offset,
            order : [
                ["created_date_time", sort_direction],
            ],
            include : [
                {
                    model : member,
                    as : "author",

                    attributes : ['nickname'],
                    include : [
                        {
                            model : author,
                            as : "author",
                            attributes: ['name','bank','account'],
                        },
                    ]
                }
                
            ]
        });
        let total_count = count;

        let renderingPage = (fields.is_remittance == 1) ? "admin/pages/remittance_withdrawal_list" : "admin/pages/unremittance_withdrawal_list"; 
        let pagination_html = helper_pagination.html(config_url.base_url + "admin/withdrawal/", page, limit, total_count, fields);
        res.render(renderingPage , {
            "fields"      : fields,
            "withdrawal_list"       : rows,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "limit"             : limit,
        });
    }
    catch(err){
        console.log(err);
    }
});


router.get("/:withdrawalId/remittance", async (req, res, next) => {
    
    checkLogin(req, res, "/admin/withdrawal/?is_remitted=0");
    let withdrawal_id = req.params.withdrawalId;
    const t = await sequelize.transaction();
    try{
        //withdrawal에서 request_date_time과 is_remittance update 해줌
        // 해당 금액 만큼 account
        await withdrawal.update({
            is_remittance: 1,
            //remitted_date_time : Date.now(),
        },
        {
            where: {
                id: withdrawal_id,
            },
            transaction: t,
        });
        const cur_withdrawal = await withdrawal.findOne({
            where: {
                id : withdrawal_id,
            },
            transaction: t,
        })
        let cur_author_id = cur_withdrawal.author_id;

        console.log(cur_withdrawal);  
        const curAccount = await account.findOne({
            where: {
                author_id: cur_author_id,
            },
            transaction: t,
        });
        let cur_account_id = curAccount.id;
        let update_request_withdrawal_amount = curAccount.request_withdrawal_amount * 1 - cur_withdrawal.amount;
        let update_total_withdrawal_amount = cur_withdrawal.amount*1 + curAccount.total_withdrawal_amount*1 ; 
        await account.update({
            request_withdrawal_amount : update_request_withdrawal_amount,
            total_withdrawal_amount : update_total_withdrawal_amount,
            
        },
        {
            where: {
                id: cur_account_id,
            },
            transaction: t,
        });
        let noti_content_withdrawal = cur_withdrawal.amount + "원이 송금되었습니다.";
        let noti_title = "송금내역";
        await notification.create({
            member_id : cur_author_id,
            content : noti_content_withdrawal,
            title: noti_title,
            type : 4,
        },{
            transaction: t,
        });
        let [notiC, created] = await notiCount.findOrCreate({
            where: {
                member_id: cur_author_id,
            },
            defaults: {
                member_id: cur_author_id,
                count: 0,
            },
            transaction: t,
        });
        await notiCount.update({
            count : notiC.count + 1,
        },
        {
            where : {
                id : notiC.id,
            },
            transaction: t,
        });

        await t.commit();
        res.redirect(config_url.base_url + "admin/withdrawal/?is_remittance=1");
    }
    catch(err){
        await t.rollback();
        console.log(err);
    }
});



module.exports = router;
