let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

module.exports = {
    // ADMIN 용
    create : async(params) => {
        var query  = "INSERT INTO favorite_book SET ? ";

        try {
            const result = await db.query(query, params)
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
        query +=    "f.id as id, b.title, b.price, f.created_date_time ";
        query += "FROM ";
        query +=    "favorite_book f, ";
        query +=    "book b ";
        query += "WHERE ";
        query +=    "f.book_id=b.id AND ";
        query +=    "f.member_id=? AND ";
        query +=    "f.status=? ";

        if (!count) {
            query += "ORDER BY " + order_by + " " + order_direction + " ";
            query += ((!limit)&&(!offset)) ? "" : "LIMIT ? OFFSET ? ";
        }

        var params = [
            member_id, 1
        ];

        if (!count && (limit || offset)) {
            params.push(limit)
            params.push(offset)
        }

        try {
            const result = await db.query(query, params)
            return (result)
        } catch(err) {
            logger.error(err);
            return (err);
        }
    },
    // ADMIN 용
    removeById : (id, callback) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "favorite_book ";
        query += "SET ";
        query +=    "status=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            0, id
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    getByMemberIdBookId : async (member_id, book_id) =>{
        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "favorite_book ";
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
            logger.error(err);
            return err;
        }
    },
    // API 용
    getByMemberId : async (member_id) => {
        
        var query = "";
        query += "SELECT ";
        query +=    "f.id, b.title, f.member_id ";
        query += "FROM ";
        query +=    "favorite_book f, "
        query +=    "book b ";
        query += "WHERE ";
        query +=    "f.book_id = b.id AND ";
        query +=    "f.member_id=? AND ";
        query +=    "f.status=? ";

        var params = [
            member_id, 1
        ];
        try{
        const result = await db.query(query, params)
            return result;
        }
        catch(err){
            logger.error(err);
            return err;
        }
    },
    // API 용
    removeByMemeberIdBookId : async(member_id, book_id) => {
        var query  = "";
        query += "UPDATE ";
        query +=    "favorite_book ";
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
    apiCreate : async (member_id, book_id) => {

        var query = "";
        query += "INSERT INTO favorite_book ";
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
