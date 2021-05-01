let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

module.exports = {
    // ADMIN 용
    create : async(payload) => {

        var query  = "INSERT INTO review SET ? ";


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
        console.log(payload)
        let member_id         = payload.member_id
        let order_by          = payload.order_by
        let order_direction   = payload.order_direction
        let limit             = payload.limit
        let offset            = payload.offset

        var query  = "";
        query += "SELECT ";
        query +=    (count) ? "count(*) as cnt " : " r.id as id, m.email as customer, b.title as book, score, r.description as review ";
        query += "FROM ";
        query +=    "review r, ";
        query +=    "member m, ";
        query +=    "book b ";
        query += "WHERE ";
        query +=    "r.member_id = m.id AND ";
        query +=    "r.book_id = b.id AND ";
        if(!!member_id) {
            query +=    "r.member_id = ? AND ";
        }
        query +=    "r.status=? ";

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
        console.log(query)

        try {
            const result = await db.query(query, params)
            console.log(result)
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
        query +=    "review ";
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
};
