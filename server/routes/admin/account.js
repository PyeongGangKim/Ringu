var express = require("express");
var router = express.Router();

const logger = require('../../utils/winston_logger');
var helper_pagination = require("../../helper/pagination");

const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const url = require("../../config/url")[env];

const { checkLogin } = require("../../helper/activity");

const { adminPageDirPath } = require("../../helper/baseDirectoryPath");

const { member, author ,withdrawal, bank,account, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");

const accountDirPath = adminPageDirPath + "account/";

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
        
        let total_count = count;
        let renderingPage = accountDirPath + "list";
        let pagination_html = helper_pagination.html(url.base_url + "admin/book/account/", page, limit, total_count, fields);
        res.render(renderingPage , {
            "fields"      : fields,
            "account_list"       : rows,
            "total_count"       : total_count,
            "pagination_html"   : pagination_html,
            "limit"             : limit,
        });
    }
    catch(err){
        logger.error(err.stack);
    }
});

router.get("/:accountId/transfer", async(req, res, next) => {
    //데이터 얻기, 

    const id = req.params.accountId;
    try{
        const findedAccount = await account.findOne({ // 함수로 빼서 findByPk
            where: {
                id: id
            },
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

        res.render(accountDirPath + "transfer", {
            "account" : findedAccount
        });
    }
    catch(err){
        logger.error(err.stack)
    }
    
});

module.exports = router;
