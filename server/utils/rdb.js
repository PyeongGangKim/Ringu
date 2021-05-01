var mysql = require('mysql2/promise');
//var mysql = require('mysql2');
var db = require('../config/database')

// var db_host = 'ami-lawform.cpw48majncyb.ap-northeast-2.rds.amazonaws.com';
var db_host = db.host
var db_user = db.user
var db_password = db.password
var db_database = db.database

var pool = mysql.createPool({
    connectionLimit: 10,
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database
});

module.exports = {
    query: async(query, params) => {
        try {
            const connection = await pool.getConnection(async conn => conn);
            try {
                const [rows] = await connection.query(query, params);
                connection.release();
                return rows;
            } catch(err) {
                connection.release();
                console.log("query error");
                return false;
            }
        } catch(err) {
            console.log("DB error");
            return false;
        }
    },

    isEmpty: (rows) => {
        if (!rows || rows.length == 0) return true;
        else return false;
    }

};


/*var DB = (function () {
    function _query(query, params) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    return reject(err);
                }

                connection.query(query, params, function (err, rows) {
                    connection.release();
                    if (!err) return resolve(rows);
                    else return reject(err);
                });

                connection.on('error', function (err) {
                    connection.release();
                    return resolve(err);
                });
            });
        });
    };

    function _isEmpty(rows) {
        if (!rows || rows.length == 0) return true;
        else return false;
    }

    return {
        query: _query,
        isEmpty: _isEmpty
    };
})();*/
