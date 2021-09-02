const { CodeGuruReviewer } = require("aws-sdk");
var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");

const { isLoggedIn, isAuthor } = require("../../middlewares/auth");
const { uploadFile, deleteFile, downloadFile, imageLoad } = require("../../middlewares/third_party/aws");

const { sequelize, category, favorite_book, book, book_detail, member, review, review_statistics, Sequelize: {Op} } = require("../../models");

router.get('/:bookId', async(req, res, next) => { //book_id로 원하는 book의 detail까지 join해서 가져오는 api
    let book_detail_id = req.params.bookId;

    try{
        const book_detail_info = await book_detail.findOne({ // data 형식이 공통되는 attributes는 그냥 가져오고, book_detail를 object로 review달려서 나올 수 있도록
            where : {
                id: book_detail_id,
            },
            attributes : [
                "id",
                [sequelize.literal("book_detail.title"),"subtitle"],
                [sequelize.literal("`book->author`.id"),"author_id"],
                [sequelize.literal("`book->author`.nickname"),"author"],
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
                        "title",
                        "price",
                        "type",

                    ],
                    include: [
                        {
                            model : member,
                            as : "author",
                            attributes: [
                                "nickname",
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
            res.status(StatusCodes.NO_CONTENT).send("No content");;
        }
        else{
            res.status(StatusCodes.OK).json({
                "book": book_detail_info,
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
            res.status(StatusCodes.OK).json({
                "message" : "OK",
            });
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});

module.exports = router;
