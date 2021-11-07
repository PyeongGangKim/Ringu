var express = require("express");
var router = express.Router();

var config_url = require("../../config/url");

var helper_pagination = require("../../helper/pagination");
var helper_date = require("../../helper/date");
const { checkLogin } = require("../../helper/activity");

const { uploadFile, deleteFile, downloadFile } = require("../../middlewares/third_party/aws");

const { member,notiCount, notification, Sequelize : { Op }, sequelize } = require("../../models/index");
const { StatusCodes } = require("http-status-codes");


router.post("/", async(req, res, next) => {

    checkLogin(req, res, "/admin/notification/");
    // 모든 사용자에게 보내기 member_type이 0 이면, 모든 멤버에게
    // 작가에게만 보내기 member_type이 1일때,
    // 두 경우다 is_admin = 0으로 하기.
    // member 찾으면 될듯
    // 그리고 object list 만들어서 notification bulk create하기.
    let member_type = [1];
    member_type.push(req.body.member_type);
    let noti_type = req.body.noti_type;
    let noti_title = req.body.noti_title;
    let noti_content = req.body.noti_content;
    const t = await sequelize.transaction();
    try{

        const member_ids = await member.findAll({
            attributes : [
                "id",
            ],
            where: {
                type:{
                    [Op.in] : member_type,
                },
                is_admin: 0,
            }
        });

        let insert_noti = [];
        for(let member_id of member_ids){ // noti bulk할 object list 만들기
            insert_noti.push({ // member_id, content, title, type
                member_id : member_id.id,
                content: noti_content,
                title: noti_title,
                type : noti_type,
            });
        }

        try{
            await notification.bulkCreate(insert_noti,{
                transaction: t,
            });
            for(let m of member_ids){
                let [notiC, created] = await notiCount.findOrCreate({
                    where: {
                        member_id: m.id,
                    },
                    defaults: {
                        member_id: m.id,
                        count: 0,
                    },
                    transaction: t,
                });
                await notiCount.update({
                    count : notiC.count + 1,
                },
                {
                    where : {
                        id : notiC.id,
                    },
                    transaction: t,
                });
            }
            await t.commit();
            res.redirect("/admin/member/");
        }
        catch(err){
            await t.rollback();
            console.error(err);
        }
    }
    catch(err){
        console.error(err);
    }
});
router.get("/page", (req,res,next) => {
    checkLogin(req, res, "/admin/notification/");
    res.render("admin/pages/notify");
})

module.exports = router;
