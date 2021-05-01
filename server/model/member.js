let bcrypt = require('bcrypt')

let salt = require('../config/salt')
let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');


module.exports = {
    // API 용
    signup: async(params) => {
        let hashed_password = bcrypt.hashSync(params.password, salt)
        params.password = hashed_password

        let query  = "INSERT INTO member SET ? ";

        try {
            const result = await db.query(query, params)
            return (result);
        } catch(err) {
            logger.error(err)
            return (err)
        }

        /*await db.query(query, params).then((result) => {
            return resolve(result.insertId);
        }).catch((err) => {
            logger.error(err);
            return reject(err);
        })*/
    },

    // API 용
    login: async(email, password) => {
        let id = 0;
        let hashed_password = '';
        let name = '';
        let tel = '';
        let type = 0;

        if (!!email) {
            let query  = "";
            query += "SELECT ";
            query +=    "id, email, password, name, tel, type ";
            query += "FROM ";
            query +=    "member ";
            query += "WHERE ";
            query +=    "email = ? ";
            query += "LIMIT 1 ";

            let params = [
                email
            ]

            try {
                const result = await db.query(query, params)
                if (db.isEmpty(result)) {
                    return {status: "error", data: {}, reason: "wrong email"};
                } else {
                    id = result[0].id;
                    email = result[0].email;
                    hashed_password = result[0].password;
                    name = result[0].name;
                    tel = result[0].tel;
                    type = result[0].type;
                }
            } catch(err) {
                logger.error(err);
                return (err);
            }

        } else {
            return {status:"error", data: {}, reason: "wrong email"}
        }
        if (!!hashed_password) {
            if (bcrypt.compareSync(password, hashed_password) == true) {
                return {status: "ok", data: {id, email, name, tel, type}};
            } else {
                return {status: "error", data: {}, reason: "wrong password"}
            }
        } else {
            return "Something wrong"
        }
    },

    // ADMIN & API 용
    get: async(userInfo) => {
        let query  = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "member ";
        query += "WHERE ";
        query +=    "? AND ";
        query +=    "status=? ";

        let params = [
            userInfo, 1
        ];

        try {
            const result = await db.query(query, params)
            return (result)
        } catch(err) {
            logger.error(err);
            return (err);
        }
    },

    changePassword: async(id, password) => {
        let hashed_password = bcrypt.hashSync(password, salt)
        let query  = "";
        query += "UPDATE ";
        query +=    "member ";
        query += "SET ";
        query +=    "password=? ";
        query += "WHERE ";
        query +=    "id=? ";

        let params = [
            password, id
        ];

        try {
            const result = await db.query(query, params)
            return (result)
        } catch(err) {
            logger.error(err);
            return (err);
        }
    },
    // API 용
    update: async(updateInfo, nickname) => {
        let query  = "";
        query += "UPDATE ";
        query +=    "member ";
        query += "SET ";
        query +=    "? ";
        query += "WHERE ";
        query +=    "id=? ";

        let params = [
            updateInfo, id
        ];

        try {
            const result = await db.query(query, params)
            return (result.affectedRows);

        } catch(err) {
            logger.error(err);
            return (err);
        }
    },

    // ADMIN 용
    getList: async(payload, count) => {
        let fields            = payload.fields
        let order_by          = payload.order_by
        let order_direction   = payload.order_direction
        let limit             = payload.limit
        let offset            = payload.offset

        let query  = "";
        query += "SELECT ";
        query +=    (count) ? "count(*) as cnt " : " * ";
        query += "FROM ";
        query +=    "member ";
        query += "WHERE ";
        if ("name" in fields && fields["name"] != "") {
            query += "name LIKE ? AND ";
        }
        if ("email" in fields && fields["email"] != "") {
            query += "email LIKE ? AND ";
        }
        if ("tel" in fields && fields["tel"] != "") {
            query += "tel LIKE ? AND ";
        }
        query += "status=? ";

        if (!count) {
            query += "ORDER BY " + order_by + " " + order_direction + " ";
            query += ((!limit)&&(!offset)) ? "" : "LIMIT ? OFFSET ? ";
        }

        let params = [];
        if ("name" in fields && fields["name"] != "") {
            params.push("%"+fields["name"]+"%")
        }
        if ("email" in fields && fields["email"] != "") {
            params.push("%"+fields["email"]+"%")
        }
        if ("tel" in fields && fields["tel"] != "") {
            params.push("%"+fields["tel"]+"%")
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
    removeById : async (id) => {
        let query  = "";
        query += "UPDATE ";
        query +=    "member ";
        query += "SET ";
        query +=    "status=? ";
        query += "WHERE ";
        query +=    "id=? ";

        let params = [
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
