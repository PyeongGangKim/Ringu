let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

module.exports = {
    // ADMIN 용
    create : async(payload) => {
        var query  = "INSERT INTO favorite_author SET ? ";

        try {
            const result = await db.query(query, payload)
            return (result);
        } catch(err) {
            logger.error(err)
            return (err)
        }
    },
    // ADMIN 용
    getList: async (payload, count) => {
        let member_id         = payload.member_id
        let order_by          = payload.order_by
        let order_direction   = payload.order_direction
        let limit             = payload.limit
        let offset            = payload.offset

        var query  = "";
        query += "SELECT ";
        query +=    "f.id as id, m.name, m.email, f.created_date_time ";
        query += "FROM ";
        query +=    "favorite_author f, ";
        query +=    "member m ";
        query += "WHERE ";
        query +=    "f.author_id=m.id AND ";
        query +=    "f.member_id=? AND ";
        query +=    "f.status=? ";


        if (!count) {
            query += "ORDER BY " + order_by + " " + order_direction + " ";
            query += ((!limit)&&(!offset)) ? "" : "LIMIT ? OFFSET ? ";
        }

        let params = [
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
    removeById : async (id) => {
        var query  = "";
        query += "UPDATE ";
        query +=    "favorite_author ";
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
    removeByMemeberIdAuthorId : async(member_id, author_id) => {
        var query  = "";
        query += "UPDATE ";
        query +=    "favorite_author ";
        query += "SET ";
        query +=    "status=? ";
        query += "WHERE ";
        query +=    "member_id=? AND ";
        query +=    "author_id=? ";

        var params = [
            0, member_id, author_id
        ];

        try {
            const result = await db.query(query, params)
            return (result);
        } catch(err) {
            logger.error(err)
            return (err)
        }

    },
    getByMemberIdAuthorId : async (member_id, author_id) =>{

        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "favorite_author ";
        query += "WHERE ";
        query +=    "member_id=? AND ";
        query +=    "author_id=? AND ";
        query +=    "status=? ";
        
        var params = [
            member_id, author_id, 1
        ];
        
        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    },
    // API 용
    getByMemberId : async (member_id) => {

        var query = "";
        query += "SELECT ";
        query +=    "f.id as id, member_id, name ";
        query += "FROM ";
        query +=    "favorite_author f, ";
        query +=    "member m ";
        query += "WHERE ";
        query +=    "f.author_id=m.id AND ";
        query +=    "f.member_id=? AND ";
        query +=    "f.status=? ";

        var params = [
            member_id, 1
        ];

        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);

        }
    },
    // API 용
    apiCreate : async (member_id, author_id) => {

        var query = "";
        query += "INSERT INTO favorite_author ";
        query +=    "(member_id, author_id) ";
        query += "VALUES ";
        query +=    "(?, ?) ";

        var params = [
            member_id, author_id
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
