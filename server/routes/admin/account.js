var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");

const { checkLogin } = require("../../helper/activity");



const { member, author ,withdrawal, account, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");

router.get("/", async (req, res, next) => {
    
    checkLogin(req, res, "/admin/account");

    
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "name"         : ("name" in req.query) ? req.query.title : "",
        "nickname"         : ("nicknmae" in req.query) ? req.query.price : "",
        
    }

    try{
        const {count, rows} = await account.findAndCountAll({
            where: {
                [Op.and] : {
                    '$author.author.name$' : (fields.name != "") ?{ [Op.like]: "%"+fields.name+"%" } : {[Op.like] : "%%" } ,
                    '$author.nickname$' : (fields.category_name != "") ? { [Op.like]: "%"+fields.nickname+"%" } : {[Op.like] : "%%" } ,
                },
            },
            limit : limit,
            offset : offset,
            order : [
                ["request_withdrawal_amount", sort_direction],
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
        let renderingPage = "admin/pages/account_list";
        let pagination_html = helper_pagination.html(config_url.base_url + "admin/book/account/", page, limit, total_count, fields);
        res.render(renderingPage , {
            "fields"      : fields,
            "account_list"       : rows,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "limit"             : limit,
        });
    }
    catch(err){
        console.log(err);
    }
});


router.post("/:accountId/transfer", async (req, res, next) => {
    
    checkLogin(req, res, "/admin/account");
    let account_id = req.params.accountId;
    try{
        const curAccount = await account.findOne({
            where: {
                id: account_id,
            }
        });
        let update_request_withdrawal_amount = 0;
        let update_total_withdrawal_amount = curAccount.request_withdrawal_amount*1 + curAccount.total_withdrawal_amount*1 ; 
        await account.update({
            request_withdrawal_amount : update_request_withdrawal_amount,
            total_withdrawal_amount : update_total_withdrawal_amount,
            
        });
            
        res.redirect(config_url.base_url + "admin/account");
    }
    catch(err){
        console.log(err);
    }
});



module.exports = router;
