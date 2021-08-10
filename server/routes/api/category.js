var express = require("express");
var router = express.Router();
const {StatusCodes} = require("http-status-codes");


const {category, Sequelize: {Op} } = require("../../models");


router.get("/:categoryId", async (req, res, next) => {//카테고리 정보 얻기.
    
    var id = req.params.categoryId;
    try{
        const result = await category.findOne({
            where: {
                id : id,
            }
        });
        res.status(StatusCodes.OK).json({
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