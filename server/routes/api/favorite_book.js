var express = require("express");
var router = express.Router();

var helper_api = require("../../helper/api");

const {favorite_book, serialization_book, single_published_book, Sequelize: {Op} } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");


router.post('/serialization', isLoggedIn,async (req, res, next) => {


    var member_id = req.body.member_id;
    var serialization_book_id = req.body.book_id;

    try{
        const duplicate_result = await favorite_book.findOne({
            where: {
                member_id : member_id,
                serialization_book_id : serialization_book_id,
                status : 1,
            }
        })
        if(duplicate_result){ 
            res.json({
                status: "error",
                reason: "duplicate"
            });
        }
    
        else{
            const result = await favorite_book.create({
                member_id : member_id,
                serialization_book_id : serialization_book_id,
            });
            res.json({status: "ok", result});
        }
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to like book"
        });
    }
});

router.post('/singlePublished', isLoggedIn,async (req, res, next) => {


    var member_id = req.body.member_id;
    var single_published_book_id = req.body.book_id;

    try{
        const duplicate_result = await favorite_book.findOne({
            where: {
                member_id : member_id,
                single_published_book_id : single_published_book_id,
                status : 1,
            }
        })
        if(duplicate_result){ 
            res.json({
                status: "error",
                reason: "duplicate"
            });
        }
    
        else{
            const result = await favorite_book.create({
                member_id : member_id,
                single_published_book_id : single_published_book_id,
            });
            res.json({status: "ok", result});
        }
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to like book"
        });
    }
});

router.get('/', isLoggedIn,async (req, res, next) => {
    var member_id = req.query.member_id;
    
    try{
        const result = await favorite_book.findAll({
            where : {
                member_id : member_id,
            }
        });
        res.json({status: "ok", result});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get the favorite_book list"
        });
    }
});

router.delete('/:favoriteBookId', isLoggedIn, async (req, res, next) => {
    
    var id = req.params.favoriteBookId;

    try{
        await favorite_book.destroy({
            where: {
                id : id,
            }
        });
        res.json({status: "ok"});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to unlike book"
        });
    }
});

module.exports = router;