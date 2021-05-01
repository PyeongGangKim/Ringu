let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');


module.exports = {
    // ADMIN 용
    create : async(payload) => {
        var query  = "INSERT INTO purchase SET ?";

        try {
            const result = await db.query(query, payload)
            return (result);
        } catch(err) {
            logger.error(err)
            return (err)
        }
    },
    // ADMIN 용
    getList: async(payload, count) => {
        let member_id         = payload.member_id
        let order_by          = payload.order_by
        let order_direction   = payload.order_direction
        let limit             = payload.limit
        let offset            = payload.offset

        var query  = "";
        query += "SELECT ";
        query +=    (count) ? "count(*) as cnt " : " p.id as id, b.title, b.price, b.type, p.created_date_time ";
        query += "FROM ";
        query +=    "purchase p, ";
        query +=    "book b ";
        query += "WHERE ";
        query +=    "p.book_id=b.id AND ";
        if(!!member_id) {
            query +=    "p.member_id = ? AND ";
        }
        query +=    "p.status=? ";

        if (!count) {
            query += "ORDER BY " + order_by + " " + order_direction + " ";
            query += ((limit=="")&&(offset=="")) ? "" : "limit ? offset ? ";
        }

        var params = []

        if(!!member_id) {
            params.push(member_id)
        }

        params.push(1)

        if (!count && (limit || offset)) {
            params.push(limit)
            params.push(offset)
        }

        try {
            const result = await db.query(query, params)            
            return (result);
        } catch(err) {
            logger.error(err);
            return (err);
        }
    },
    // ADMIN 용
    removeById : async(id) => {
        var query  = "";
        query += "UPDATE ";
        query +=    "purchase ";
        query += "SET ";
        query +=    "status=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            0, id
        ];

        try {
            const result = await db.query(query, params)
            return (result);
        } catch(err) {
            logger.error(err)
            return (err)
        }
    },
    // API 용
    removeByMemeberIdBookId : async(member_id, book_id) => {
        var query  = "";
        query += "UPDATE ";
        query +=    "purchase ";
        query += "SET ";
        query +=    "status=? ";
        query += "WHERE ";
        query +=    "member_id=? AND ";
        query +=    "book_id=? ";

        var params = [
            0, member_id, book_id
        ];

        try {
            const result = await db.query(query, params)
            return (result);
        } catch(err) {
            logger.error(err)
            return (err)
        }

    },
    // API 용
    getByMemberId : async (member_id) => {

        var query = "";
        query += "SELECT ";
        query +=    "p.id as id, title ";
        query += "FROM ";
        query +=    "purchase p, ";
        query +=    "book b ";
        query += "WHERE ";
        query +=    "p.book_id=b.id AND ";
        query +=    "p.member_id=? AND ";
        query +=    "p.status=? ";

        var params = [
            member_id, 1
        ];
        try{
            const result = db.query(query, params)
            return result;
        }
        catch(err){
            logger.log(err);
            return err;
        }
    },
    //API 용
    getByMemberIdBookId : async (member_id, book_id) => {
        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "purchase ";
        query += "WHERE ";
        query +=    "member_id=? AND ";
        query +=    "book_id=? AND ";
        query +=    "status=? ";

        var params = [
            member_id, book_id, 1
        ];
        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.log(err);
            return err;
        }
    },
    apiCreate : async (member_id, book_id) => {

        var query = "";
        query += "INSERT INTO purchase ";
        query +=    "(member_id, book_id) ";
        query += "VALUES ";
        query +=    "(?, ?) ";

        var params = [
            member_id, book_id
        ];
        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return err;
        }

    }
};
