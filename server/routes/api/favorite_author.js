var express = require("express");
var router = express.Router();

const StatusCodes = require("../../helper/statusCodes");
const { getImgURL } = require("../../utils/aws");
const {sequelize ,member ,favorite_author, favorite_author_statistics, review_statistics, Sequelize: {Op} } = require("../../models");
const { isLoggedIn } = require("../../middlewares/auth");



router.post('/', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    var author_id = req.body.author_id;
    const t = await sequelize.transaction();
    try{
        await favorite_author.create({
                member_id : member_id,
                author_id : author_id,
        },{
            transaction : t,
        });
        const [find_favorite_author_statistics, created] = await favorite_author_statistics.findOrCreate({
            where:{
                author_id : author_id,
            },
            defaults: {
                author_id : author_id,
                favorite_person_number: 0,

            },
            transaction: t,
        });
        let added_person_number = find_favorite_author_statistics.favorite_person_number*1 + 1;
        let favorite_author_statistics_id = find_favorite_author_statistics.id;
        await favorite_author_statistics.update({
            favorite_person_number: added_person_number
        },{
            where: {
                id: favorite_author_statistics_id
            },
            transaction: t,
        });
        await t.commit();
        res.status(StatusCodes.CREATED).send("success like");
    }
    catch(err){
        await t.rollback();
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});
router.get('/duplicate', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    var author_id = req.query.author_id;

    try{
        const result = await favorite_author.findOne({
            where: {
                member_id : member_id,
                author_id : author_id,
                status : 1,
            }
        });
        if(result !== null){
            res.status(StatusCodes.DUPLICATE).json({
                "message" : "duplicate",
            });
        }
        else{
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }

});

router.get('/:authorId', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    var author_id = req.params.authorId;

    try {
        const fav = await favorite_author.findOne({
            where: {
                member_id: member_id,
                author_id: author_id
            }
        })

        if(fav) {
            res.status(StatusCodes.OK).json({
                "favoriteAuthor": fav,
            })
        }
        else{
            res.status(StatusCodes.NO_CONTENT).json({
                "message" : "NO_CONTENT",
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
})

router.get('/', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    try{
        const favoriteAuthorList = await favorite_author.findAll({
            attributes : [
                "id",
                "author_id",
                [sequelize.literal("author.nickname"), "author_nickname"],
                [sequelize.literal("author.description"), "author_description"],
                [sequelize.literal("author.profile"), "profile"],
                [sequelize.literal("SUM(`author->review_statistics`.score_amount)"), "review_score"],
                [sequelize.literal("SUM(`author->review_statistics`.person_number)"), "review_count"],
                [sequelize.literal("SUM(`author->favorite_author_statistic`.favorite_person_number)"), "favorite_count"],
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
                        "profile",
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
                        {
                            model: favorite_author_statistics,
                            as: "favorite_author_statistic",
                            attributes : [],
                        }
                    ],
                },
            ],
            group: "author.id"
        });
        if(favoriteAuthorList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("no content");
        }
        else{
            for(let i = 0 ; i < favoriteAuthorList.length ; i++){
                if(favoriteAuthorList[i].dataValues.profile == null || favoriteAuthorList[i].dataValues.profile[0] == 'h') continue;
                favoriteAuthorList[i].dataValues.profile = getImgURL(favoriteAuthorList[i].dataValues.profile);
            }
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
    const t = await sequelize.transaction();
    try{
        const cancel_favorite_author = await favorite_author.findOne({
            where: {
                id : id
            },
        });
        await favorite_author.destroy({
            where:{
                id : id,
            },
            transaction: t,
        });
        let cancel_favorite_author_id = cancel_favorite_author.author_id;
        const cancel_favorite_author_statistics = await favorite_author_statistics.findOne({
            where: {
                author_id: cancel_favorite_author_id
            }
        });
        let cancel_favorite_person_number = cancel_favorite_author_statistics.favorite_person_number - 1;
        await favorite_author_statistics.update({
            favorite_person_number : cancel_favorite_person_number,
        },{
            where:{
                author_id : cancel_favorite_author_id,
            },
            transaction: t,
        });
        await t.commit();
        res.status(StatusCodes.OK).json({
            "message" : "OK",
        });

    }
    catch(err){
        await t.rollback();
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

module.exports = router;
