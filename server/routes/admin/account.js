var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");

const { checkLogin } = require("../../helper/activity");



const { member, author ,withdrawal, bank,account, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");

router.get("/", async (req, res, next) => {
    
    checkLogin(req, res, "/admin/account");

    
    let sort_direction  = ("sort_direction" in req.query) ? req.query.sort_direction : "DESC";
    let limit           = ("limit" in req.query && req.query.limit) ? parseInt(req.query.limit) : 10;
    let page            = ("page" in req.query) ? req.query.page : 1;
    let offset          = parseInt(limit) * (parseInt(page)-1);

    let fields = {
        "name"         : ("name" in req.query) ? req.query.name : "",
        "nickname"         : ("nicknmae" in req.query) ? req.query.nickname : "",
        
    }
    console.log(fields);
    try{
        const {count, rows} = await account.findAndCountAll({
            where: {
                [Op.and] : {
                    '$author.author.name$' : (fields.name != "") ? { [Op.like]: "%"+fields.name+"%" } : {[Op.like] : "%%" } ,
                    '$author.nickname$' : (fields.nickname != "") ? { [Op.like]: "%"+fields.nickname+"%" } : {[Op.like] : "%%" } ,
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
                            include: [
                                {
                                    model: bank,
                                    as: "bank_bank",
                                }
                            ]
                        },
                    ]
                }
                
            ]
        });
        console.log(rows);
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


module.exports = router;
