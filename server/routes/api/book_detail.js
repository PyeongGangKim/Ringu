const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");
var router = express.Router();

const statusCodes = require("../../helper/statusCodes");
const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");

const { sequelize, category, favorite_book, book, book_detail, member, review, review_statistics, Sequelize: {Op} } = require("../../models");

router.post('/', isLoggedIn, isAuthor, uploadFile, async(req, res, next) => {
    let page_number = "page_number" in req.body && typeof req.body.page_number !== 'undefined' ? req.body.page_number : null;
    let file = req.files.file[0].key;
    let book_id = req.body.book_id;
    let title = req.body.title;
    let round = "round" in req.body && typeof req.body.round !== 'undefined' ? req.body.round : null;

    try{
        const detail = await book_detail.create({
            title: title,
            book_id : book_id,
            page_number : page_number,
            file : file,
            round: round
        });

        res.status(statusCodes.CREATED).json({
            detail: detail
        })
    }
    catch(err){
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.get('/:bookId', async(req, res, next) => { //book_id로 원하는 book의 detail까지 join해서 가져오는 api
    let book_detail_id = req.params.bookId;

    try{
        const book_detail_info = await book_detail.findOne({ // data 형식이 공통되는 attributes는 그냥 가져오고, book_detail를 object로 review달려서 나올 수 있도록
            where : {
                id: book_detail_id,
            },
            attributes : [
                "id",
                ["title","subtitle"],
                [sequelize.literal("`book->author`.id"),"author_id"],
                [sequelize.literal("`book->author`.nickname"),"author"],
                [sequelize.literal("book.img"),"img"],
                [sequelize.literal("book.id"),"book_id"],
                [sequelize.literal("book.price"),"price"],
                [sequelize.literal("book.type"),"type"],
                [sequelize.literal("book.title"),"title"],
            ],

            include : [
                {
                    model : book,
                    as : "book",
                    attributes: [
                    ],
                    include: [
                        {
                            model : member,
                            as : "author",
                            attributes: [
                            ],
                        },
                        {
                            model : category,
                            as : "category",
                            attributes : [
                            ],
                        },
                    ]
                },
            ],
        });

        if(book_detail_info.length == 0){
            res.status(statusCodes.NO_CONTENT).send("No content");;
        }
        else{
            book_detail_info.dataValues.img = imageLoad(book_detail_info.dataValues.img)
            res.status(statusCodes.OK).json({
                "book": book_detail_info,
            });
        }

    }
    catch(err){
        console.error(err);
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "error": "server error"
        });
    }
});

router.delete('/:bookDetailId', isLoggedIn, async (req, res, next) => {
    let id = req.params.bookDetailId;

    try{
        const result = await book_detail.update({
            status: 0,
        },
        {
            where: {
                id : id,
            }
        });
        if(result){
            res.status(statusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});

module.exports = router;
