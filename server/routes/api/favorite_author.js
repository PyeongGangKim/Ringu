var express = require("express");
var router = express.Router();


var helper_api = require("../../helper/api");


const {sequelize ,author ,favorite_author, Sequelize: {Op} } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.post('/', isLoggedIn, async (req, res, next) => {
    if(!helper_api.required(req, ['member_id', 'author_id'])){
        var names = helper_api(req,['member_id','author_id'],true);
        helper_api.missing(res, names);
        return;
    }

    var member_id = req.body.member_id;
    var author_id = req.body.author_id;
    try{
        const duplicate_result = await favorite_author.findOne({
            where: {
                member_id : member_id,
                author_id : author_id,
                status : 1,
            }
        });
        if(duplicate_result){
            res.json({
                status: "error",
                reason: "duplicate",
            })
        }
        else{
            const result = await favorite_author.create({
                member_id : member_id,
                author_id : author_id,
            })
            res.json({status: "ok", result});
        }
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to like author"
        })
    }
});

router.get('/', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    try{
        const result = await favorite_author.findAll({
            attributes : [
                "id",
                "author_id",
                [sequelize.literal("author.name"),"author"],
            ],
            include : [
                {
                    model : author,
                    as : "author",
                    attributes : [],
                }
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
        });
        res.json({status: "ok", result});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get the favorite author's list"
        })
    }
});

router.delete('/:favoriteAuthorId', isLoggedIn, async (req, res, next) => {

    var id = req.params.favoriteAuthorId;

    try{
        await favorite_author.destroy({
            where:{
                id : id,
            }
        })
        res.json({status: "ok"});
    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to unlike author"
        });
    }
});

module.exports = router;
