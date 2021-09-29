var express = require("express");
var router = express.Router();

const {StatusCodes} = require("http-status-codes");
const { isLoggedIn } = require("../../middlewares/auth");


const {sequelize, notification , member, Sequelize : {Op}} = require("../../models");
//type : 1.작품 알림, 2.출금알림, 3.공지사항
router.get('/' ,isLoggedIn, async (req, res, next) => { //한명의 notification 모든 종류 다 가져오기.

    const member_id = req.user.id;
    const type = (req.query.type === undefined) ? [1,2,3] : req.query.type;
    const offset = req.query.offset * 1;
    const limit = 10;
    console.log(req.query);
    console.log(offset);
    try{
        const notifications = await notification.findAll({
            attributes : [
                "id",
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
                type: type, 
            },
            include : {
                as: "member",
                model: member,
                attributes: [],
            },
            limit : limit,
            offset: offset,
            order: [
                ["created_date_time", "DESC"]
            ],
        });
        res.status(StatusCodes.OK).json({
            "notification_list" : notifications,
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});
router.get('/allNewNotiCount', isLoggedIn, async(req, res, next) => {
    let member_id = req.user.id;
    try{
        const newNotiCount = await notiCount.findOne({
            where : {
                member_id : member_id
            }
        });
        console.log(newNotiCount.count);
        res.status(StatusCodes.OK).json({
            new_notification_count: newNotiCount.count,
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});
router.get('/newNotiCnt', isLoggedIn, async (req, res, next) => {
    let member_id = req.user.id;
    let type = req.query.type;
    try{
        const unread_cnt = await notification.count({
            where : {
                member_id : member_id,
                status : 1,
                type: type,
                is_read : 0,
            }   
        });
        res.status(StatusCodes.OK).json({
            unread_count : unread_cnt
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
});
router.get('/allCount', isLoggedIn, async(req, res, next) => {
    const member_id = req.user.id;
    const type = req.query.type;
    try{
        const unread_cnt = await notification.count({
            where : {
                member_id : member_id,
                status : 1,
                type: type,
            }   
        });
        res.status(StatusCodes.OK).json({
            all_count : unread_cnt
        });
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
})
router.post('/delete', isLoggedIn, async (req, res, next) => { // 필요없는 기능일 듯
    let notification_ids = req.body.notificationIds;
    console.log(notification_ids)
    try{
        await notification.destroy({
            where : {
                id : notification_ids,
            }
        })
        res.status(StatusCodes.OK).json({
            "message": "OK"
        });
    
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
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
        res.status(StatusCodes.OK).json({
            "message": "ok",
        })
    }
    catch(err){
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "message" : "server error",
        });
    }
})

module.exports = router;