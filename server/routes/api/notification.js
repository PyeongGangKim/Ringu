var express = require("express");
var router = express.Router();


const { isLoggedIn } = require("../../middlewares/auth");


const {sequelize, notification , member, Sequelize : {Op}} = require("../../models");
//type : 1.작품 알림, 2.출금알림, 3.공지사항
router.get('/' ,isLoggedIn, async (req, res, next) => { //한명의 notification 모든 종류 다 가져오기.

    let member_id = req.user.id;

    try{
        const notifications = await notification.findAll({
            attributes : [
                [sequelize.literal("member.nickname"), "nickname"],
                "title",
                "content",
                "is_read",
                "type",
                ["created_date_time", "date"],
            ],
            where : {
                member_id : member_id,
                status : 1,  
            },
            include : {
                as: "member",
                model: member,
                attributes: [],
            },
            order: [
                ["created_date_time", "ASC"]
            ],
        });
        res.json({status: "ok", notifications});
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "fail to get notifications"
        });
    }
});

router.get('/book', isLoggedIn, async (req, res, next) => {
    var member_id = req.user.id;
    try{
        const book_notifications = await notification.findAll({
            attributes : [
                [sequelize.literal("member.nickname"), "nickname"],
                "title",
                "content",
                "is_read",
                ["created_date_time", "date"],
            ],
            where: {
                member_id : member_id,
                status : 1,
                type: 1,
            },
            include : {
                as: "member",
                model: member,
                attributes:[],
            },
            order: [
                ["created_date_time", "ASC"]
            ],
        });
        res.json({status: "ok", book_notifications});
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "fail to get book notification list"
        });
    }
});
router.get('/withdrawal', isLoggedIn, async (req, res, next) => {
    let member_id = req.user.id;
    try{
        const withdrawal_notifications = await notification.findAll({
            attributes : [
                [sequelize.literal("member.nickname"), "nickname"],
                "title",
                "content",
                "is_read",
                ["created_date_time", "date"],
            ],
            where: {
                member_id : member_id,
                status : 1,
                type: 2,
            },
            include : {
                as: "member",
                model: member,
                attributes:[],
            },
            order: [
                ["created_date_time", "ASC"]
            ],
        });
        res.json({status: "ok", withdrawal_notifications});
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "fail to get withdrawal notification list"
        });
    }
});
router.get('/notice', isLoggedIn, async (req, res, next) => {
    let member_id = req.user.id;
    try{
        const notice_notifications = await notification.findAll({
            attributes : [
                [sequelize.literal("member.nickname"), "nickname"],
                "title",
                "content",
                "is_read",
                ["created_date_time", "date"],
            ],
            where: {
                member_id : member_id,
                status : 1,
                type: 3,
            },
            include : {
                as: "member",
                model: member,
                attributes:[],
            },
            order: [
                ["created_date_time", "ASC"]
            ],
        });
        res.json({status: "ok", notice_notifications});
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "fail to get notice notification list"
        });
    }
});
router.delete('/:notificationId', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯
    let notification_id = req.params.notificationId;

    try{
        await notification.destroy({
            where : {
                id : notification_id,
            }
        })
        res.json({status: "ok"});
    
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "fail to delete notification"
        });
    }
});
router.put('/:notificationId', isLoggedIn, async(req, res, next) => { // 읽은 공지 여부
    let notificatino_id = req.params.notificationId;
    try{
        await notification.update({
            is_read : 1,   
        },
        {
            where: {
                id: notificatino_id,
            }
        });
        res.json({
            status: "ok",
        })
    }
    catch(err){
        console.error(err);
        res.json({
            status: "error",
            error: err,
            reason: "fail to update reading notification "
        });
    }
})

module.exports = router;