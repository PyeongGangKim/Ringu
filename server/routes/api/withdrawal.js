var express = require("express");
var router = express.Router();


const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { sequelize,withdrawal, member ,author } = require("../../models");

router.post('/', isLoggedIn, async(req, res, next) => {
    let amount = req.body.amount;
    let author_id = req.body.author_id;
    try{
        await withdrawal.create({
            author_id : author_id,
            amount: amount,
            status: 1,
        });
        res.json({status: "ok"});
    }
    catch(err){
        console.error(err);
    }
});

router.get('/', isLoggedIn, isAuthor,async (req, res, next) => {

    // POST
    let author_id = req.query.author_id;
    try{
        const result = await withdrawal.findAll({
            attributes : [
                [sequelize.literal("author.name"),"name"],
                "amount",
            ]
            ,where: {
                author_id : author_id,
            },
            include : {
                model : author,
                as : "author",
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

    // DB LOAD
    
});


module.exports = router;
