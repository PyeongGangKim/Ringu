var express = require("express");
var router = express.Router();


var helper_api = require("../../helper/api");

const {StatusCodes} = require("http-status-codes");

const {sequelize ,member ,favorite_author, review_statistics, Sequelize: {Op} } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.post('/', isLoggedIn, async (req, res, next) => {
    

    var member_id = req.user.id;
    var author_id = req.body.author_id;
    try{
        await favorite_author.create({
                member_id : member_id,
                author_id : author_id,
        });
        res.status(StatusCodes.OK).send("success like");
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.post('/duplicate', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
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
            res.status(StatusCodes.CONFLICT).send("Duplicate");
        }
        else{
            res.status(StatusCodes.OK).send("No Duplicate");
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
        const favoriteAuthorList = await favorite_author.findAll({
            attributes : [
                "id",
                "author_id",
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("author.description"), "author_description"],

                [sequelize.literal("SUM(`author->review_statistics`.score_amount)"), "review_score"],
                [sequelize.literal("SUM(`author->review_statistics`.person_number)"), "review_count"],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : [
                {
                    model : member,
                    as : "author",
                    attributes : [
                        "id",
                        "nickname",
                        "description",
                    ],
                    include: [
                        {
                            model: review_statistics,
                            as : "review_statistics",
                            attributes : [
                                "score_amount",
                                "person_number",
                            ],
                        },
                    ],
                },
            ],
            group: "author.id"
        });
        if(favoriteAuthorList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no content");
        }
        else{
            res.status(StatusCodes.OK).json({
                "favoriteAuthorList": favoriteAuthorList
            });
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
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
        res.status(StatusCodes.OK)
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

module.exports = router;
