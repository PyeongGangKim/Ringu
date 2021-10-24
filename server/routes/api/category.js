var express = require("express");
var router = express.Router();

const statusCodes = require("../../helper/statusCodes");

const {category, Sequelize: {Op} } = require("../../models");

router.get("/", async (req, res, next) => {//카테고리 정보 얻기.
    try{
        const result = await category.findAll();
        res.status(statusCodes.OK).json({
            categoryList: result,
        })
    }
    catch(err){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            error: "fail to get the category info"
        })
    }
})

router.get("/:categoryId", async (req, res, next) => {//카테고리 정보 얻기.

    var id = req.params.categoryId;
    try{
        const result = await category.findOne({
            where: {
                id : id,
            }
        });
        res.status(statusCodes.OK).json({
            category: result,
        })

    }
    catch(err){
        res.json({
            status: "error",
            error: err,
            reason: "fail to get the category info"
        })
        console.log(err);
    }
})


module.exports = router;
