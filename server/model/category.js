let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');
module.exports = {
    //ADMIN 용
    create : async (parent_id, name) => {

        var query = "";
        query += "INSERT INTO category ";
        query +=    "(parent_id, name) ";
        query += "VALUES ";
        query +=    "(?, ?) ";

        var params = [
            parent_id, name
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
    getTopCategory : async () =>{
        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "parent_id ";
        query +=    "is null ";

        try{
            const result = await db.query(query)
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    },
    getByParentId : async (parent_id) => {
        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "parent_id=? ";

        params = [
            parent_id
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
    getByParentIds: async (parent_id) => {
        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "parent_id in ( ";

        for(var i = 0 ; i < parent_id.length ; i++){
            if(parent_id.length - 1 === i) query += parent_id[i] + ")";
            else query += parent_id[i] + " , ";
        }

        try{
            const result = await db.query(query);
            return result;
        }
        catch(err){
            logger.error(err);
            return err;
        }
    },
    getTopCategoryIdByName: async (name) => {
        var query = "";
        query += "SELECT ";
        query +=    "id ";
        query += "FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "name LIKE ? AND ";
        query +=    "parent_id is null";

        params = ["%" + name + "%"];

        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    },

    //ADMIN & API 용
    getCategoryIdByParentIdAndName: async (parent_id, name) =>{
        
        var query = "";
        query += "SELECT ";
        query +=    "id ";
        query += "FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "name LIKE ? AND ";
        query +=    "parent_id in ";
        query +=    "( ";

        for(var i = 0 ; i < parent_id.length ; i++){
            if(i != parent_id.length - 1 ) query += parent_id[i] + ", ";
            else query += parent_id[i];
        }
        query += " )";
        
        params = ["%" + name + "%"];
        
        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    },
    //ADMIN & API 용
    getById : async (id) => {

        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            id
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
    //ADMIN 용
    updateName : async (id, name) => {
        var query = "";
        query += "UPDATE ";
        query +=    "category ";
        query += "SET ";
        query +=    "name=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            name, id
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

    //ADMIN 용
    removeById : async (id) => {
        var query = "";
        query += "DELETE FROM ";
        query +=    "category ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            id
        ];

        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    }
};