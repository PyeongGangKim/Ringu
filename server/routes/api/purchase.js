var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { isLoggedIn, isAuthor } = require("../../middlewares/auth");


const {book_detail, sequelize, member, purchase, book, Sequelize : {Op}} = require("../../models");




router.post('/' ,isLoggedIn, async (req, res, next) => { // 구매 생성 api
    let member_id = req.body.member_id;
    let book_detail_id = req.body.book_detail_id;
    let price = req.body.price;
    try{
        const duplicate_result = await purchase.findOne({
            where : {
                member_id : member_id,
                book_detail_id : book_detail_id,
                status: 1,
            }
        });
        if(duplicate_result){
            res.status(StatusCodes.CONFLICT).send("Duplicate");
            return;
        }
        const result = await purchase.create({
            member_id : member_id,
            book_detail_id : book_detail_id,
            price: price,
        })
        console.log(result);
        res.status(StatusCodes.OK).send("success purchasing");

    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});
router.post('/many' , isLoggedIn, async (req, res, next) => { // 모두 구매
    try{
        let purchaseList = req.body.purchaseList;
        const result = await purchase.bulkCreate(
            purchaseList,
        );
        console.log(result);
        res.status(StatusCodes.OK).send("success purchasing");
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
        console.error(err);
    }
});

router.get('/', isLoggedIn, async (req, res, next) => {// 구매한 리스트 가져오기
    var member_id = req.user.id;

    try{
        const purchaseList = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                "price",
                [sequelize.literal("book_detail.title"), "title"],
                [sequelize.literal("`book_detail->book`.type"), "type"],
                [sequelize.literal("book_detail.file"), "file"],
                [sequelize.literal("`book_detail->book->author`.nickname"),"author"],
            ],
            where: {
                member_id : member_id,
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : 'book_detail',
                    attributes: [],
                    include: [
                        {
                            model: book,
                            as : 'book',
                            attributes : [],
                            include : [
                                {
                                    model: member,
                                    as: 'author',
                                    attributes: [],
                                }
                            ]
                        }
                    ]
                },

            ]
        });

        if(purchaseList.length == 0){
            res.status(StatusCodes.NO_CONTENT).send("No content");
        }
        else{
            res.status(StatusCodes.OK).json({
                purchaseList : purchaseList,
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
router.get('/sellingList', isLoggedIn, isAuthor,async (req, res, next) => { //작가 입장에서 판 책들 가져오기
    var author_id = req.query.author_id;
    try{
        const selling_list = await purchase.findAll({
            attributes: [
                "id",
                "created_date_time",
                "price",
                [sequelize.literal("book_detail.title"), "title"],
                [sequelize.literal("member.name"), "buyer_name"],
            ],
            where: {
                status : 1,
            },
            include : [
                {
                    model : book_detail,
                    as : "book_detail",
                    attributes : [],
                    required: true,
                    include : [
                        {
                            model: book,
                            as : "book",
                            where : {author_id: author_id},
                            attributes: [],
                        }
                    ]
                },
                {
                    model : member,
                    as: "member",
                    attributes : [],
                }
            ],
        });
        if(selling_list.length == 0){
            console.log(selling_list);
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            console.log(selling_list);
            res.status(StatusCodes.OK).json({
                selling_list : selling_list,
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


router.delete('/:purchaseId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯


    var id = req.params.purchaseId;

    try{
        await purchase.destroy({
            where : {
                id : id,
            }
        })
        res.json({status: "ok"});

    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to cancel purchasing"
        });
    }
});

module.exports = router;
