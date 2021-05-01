var express = require("express");
var router = express.Router();



const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize, single_published_book, serialization_book, book, purchase, withdrawal, member, author } = require("../../models");

router.post('/', isLoggedIn, async(req, res, next) => {
    let name = req.body.name;
    let bank = req.body.bank;
    let account = req.body.account;
    let description = req.body.description;
    let tax_agreement = req.body.tax_agreement;
    let promotion_agency_agreement = req.body.promotion_agency_agreement;

    try{
        const result = await author.create({
            name : name,
            bank : bank,
            account : account,
            description : description,
            member_id : req.user.id,
            tax_agreement : (tax_agreement) ? 1 : 0,
            promotion_agency_agreement : (promotion_agency_agreement) ? 1 : 0,
        });

        if(result){
            await member.update({
                type: 1,
            },{
                where : {
                     id : req.user.id       
                }
            });
            if(changedMeberType){
                res.json({status : "ok", result});
            }
        }
        else{
            res.json({status: "error"});
        }
    }
    catch(err){
        console.error(err);
    }

})
router.get('/:authorId', isLoggedIn, isAuthor,async (req, res, next) => {

    let id = req.params.authorId;
    try{
        const result = await author.findOne({
    
            attributes: [
                "id",
                "description",
                "member_id",
                [sequelize.literal("member.name"),"name"],
            ],
            where: {
                id : id
            },
            include : {
                model : member,
                as : "member",
                attributes : [],
            }
        });
        if(result){
            res.json({status : "ok", result});
        }
        else{
            res.json({status: "error", reason: "fail to get author information"});
        }
    }
    catch(err){
        console.error(err);
    }    
});
router.get('/revenue/:authorId', isLoggedIn, isAuthor,async (req, res, next) => {

    let id = req.params.authorId;
    try{
        const serialization_publised_revenue = await author.findAll({
            raw: true,
            attributes : [
                "id",
                [sequelize.literal("serialization_books.id"),"serialization_book_id"],
                [sequelize.literal("serialization_books.price"),"price"],
                [sequelize.literal("`serialization_books->books->purchases`.id"),"purchase_id"],
                [sequelize.literal("count(`serialization_books->books->purchases`.id)"), "selled_count"],
            ],
            include: [
                {
                    model: serialization_book,
                    as : "serialization_books",
                    attributes : [],
                    where : {
                        author_id : id,
                    },
                    include: [
                        {
                            model: book,
                            as : "books",
                            attributes: [],
                            where: {
                                status: 1,
                            },
                            include: [
                                {
                                    model: purchase,
                                    as : "purchases",
                                    attributes:[],
                                    where: {status: 1}
                                }
                            ]
                        },
                    ],
                },  
            ],
            group: ["serialization_books.id"],
        });
        console.log(serialization_publised_revenue);
        const signle_published_revenue = await author.findAll({
            raw: true,
            attributes : [
                "id",
                [sequelize.literal("single_published_books.id"),"single_published_book_id"],
                [sequelize.literal("single_published_books.price"),"price"],
                [sequelize.literal("`single_published_books->book->purchases`.id"),"purchase_id"],
                [sequelize.literal("count(`single_published_books->book->purchases`.id)"), "selled_count"],
            ],
            where : {
                id : id,
            },
            include: [
                {
                    model: single_published_book,
                    as : "single_published_books",
                    attributes : [],
                    include: [
                        {
                            model: book,
                            as : "book",
                            required: true,
                            attributes: [],
                            include: [
                                {
                                    model: purchase,  
                                    as : "purchases",
                                    attributes:[],
                                }
                            ]
                        },
                    ],
                },  
            ],
            group: ["single_published_books.id"],
        });
        console.log(signle_published_revenue);
        const author_revenue = await author.findOne({
            raw: true,
            attributes: [
                "id",
                "description",
                "bank",
                "account",
                "name",
                [sequelize.literal("sum( withdrawals.amount )"), "withdrawal_amount"],
            ],
            where: {
                id : id
            },
            include :[
                {
                    model: withdrawal,
                    as : "withdrawals",
                    attributes : [],
                },
            ],
        });
        console.log(author_revenue);
        
        let sp_amount = 0;
        let serial_amount = 0;
        for(let i = 0 ; i < signle_published_revenue.length ; i++){
            sp_amount += signle_published_revenue[i].selled_count*signle_published_revenue[i].price;
        }
        for(let i = 0 ; i < serialization_publised_revenue.length ; i++){
            serial_amount += serialization_publised_revenue[i].selled_count * serialization_publised_revenue[i].price;
        }
        author_revenue.withdrawable_amount = serial_amount + sp_amount - author_revenue.withdrawal_amount;
        delete author_revenue.withdrawal_amount;
        console.log(author_revenue);
        res.json({status : "ok", author_revenue});
    }
    catch(err){
        res.json({status: "error", reason: "fail to get author revenue information"});
        console.error(err);
    }    
});
module.exports = router;
