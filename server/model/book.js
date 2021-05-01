
let db = require('../utils/rdb');
let logger = require('../utils/winston_logger');

module.exports = {
    // API 용
    create : async (fields) => {
        var title = fields["title"];
        var file = fields["file"];
        var price = fields["price"];
        var type = fields["type"];
        var member_id = fields["member_id"];
        var category_id = fields["category_id"];

        var query  = "INSERT INTO book ";
            query +=    "(title, file, price, type, member_id, category_id) ";
            query += "VALUES ";
            query +=    "(?, ?, ?, ?, ?, ?) ";

        var params = [
            title, file, price, type, member_id, category_id
        ];

        try{
            const result = db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    },
    // ADMIN& API 용
    getByMemberId: (member_id, callback) => {

        var query  = "";
        query += "SELECT ";
        query +=    "id, title,description,file, price, type, data_created, is_approved";
        query += "FROM ";
        query +=    "book ";
        query += "WHERE ";
        query +=    "member_id=? AND ";
        query +=    "status=? ";

        var params = [
            member_id, 1
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    // ADMIN & API 용
    getByMemberIdIsApproved: async (member_id) => {

        var query  = "";
        query += "SELECT ";
        query +=    "id, title, description,file, price, type, data_created";
        query += "FROM ";
        query +=    "book ";
        query += "WHERE ";
        query +=    "member_id=? AND ";
        query +=    "is_approved=? AND";
        query +=    "status=? ";
        

        var params = [
            member_id, 1, 1
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
    updateIsApproved: async (id, is_approved, callback) =>{

        var query = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "is_approved=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            is_approved, id
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
    //API용
    updateTitle: (id, title, callback) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "title=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            title, id
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    // API 용
    updateDescription: (id, description, callback) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "description=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            description, id
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    // API 용
    updateFile: (id, file, callback) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "file=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            file, id
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    updatePrice: (id, price, callback) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "price=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            price, id
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    // ADMIN 용
    updateType: (id, type, callback) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "type=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            type, id
        ];

        db.query(query, params, (err, result) => {
            if (err) console.log(err);
            callback(err, result);
        });
    },
    //ADMIN 용 & API 용
    updateCategory : (id, category_id, callback) => {
        var query = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "category_id=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            category_id, id
        ];

        db.query(query, params, (err, result) => {
            if(err) console.log(err);
            callback(err, result);
        });
            
    },
    // ADMIN 용
    getList: async(payload, count) => {
        let fields            = payload.fields
        let sort_by          = payload.sort_by
        let sort_direction   = payload.sort_direction
        let limit             = payload.limit
        let offset            = payload.offset

        let query  = "";
        query += "SELECT ";
        query +=    (count) ? "count(*) as cnt " : "b.id as id, title, name, price, member_id, is_approved, file ";
        query += "FROM ";
        query +=    "book b, ";
        query +=    "category c ";
        query += "WHERE ";
        query +=    "b.category_id=c.id AND ";
        if ("title" in fields && fields["title"] != "") {
            query += "title LIKE ? AND ";
        }
        if ("price" in fields && fields["price"] != "") {
            query += "price <= ? AND ";
        }
        if ("is_approved" in fields && fields["is_approved"] != "") {
            query += "is_approved= ? AND ";
        }
        if ("category_id" in fields && fields["category_id"] != ""){
            query += "b.category_id in ( ";
            category_id = fields["category_id"];
            for(var i = 0 ; i <  category_id.length ; i++){
                if(i != category_id.length - 1 ) query += category_id[i] + ", ";
                else query += category_id; 
            }
            query += " ) AND ";
        }
        
        query += "status=? ";

        if (!count) {
            query += "ORDER BY " + sort_by + " " + sort_direction + " ";
            query += ((!limit)&&(!offset)) ? "" : "LIMIT ? OFFSET ? ";
        }

        let params = [];
        if ("title" in fields && fields["title"] != "") {
            params.push("%"+fields["title"]+"%")
        }
        if ("price" in fields && fields["price"] != "") {
            params.push(fields["price"])
        }
        if ("is_approved" in fields && fields["is_approved"] != "") {
            params.push(fields["is_approved"])
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
    getByTitle: async (title) =>{
        var query = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "book ";
        query += "WHERE ";
        query +=    "title=? ";
        
        var params = [
            title
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
    // ADMIN, API 용
    getById: async (id) => {

        var query  = "";
        query += "SELECT ";
        query +=    "* ";
        query += "FROM ";
        query +=    "book ";
        query += "WHERE ";
        query +=    "id=? AND ";
        query +=    "status=? ";

        var params = [
            id, 1
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
    getByCategoryId : async (category_ids) => {
        var query = "";
        query += "SELECT ";
        query +=    "b.id as id, title, name, price, member_id, is_approved, file ";
        query += "FROM ";
        query +=    "book b, ";
        query +=    "category c ";
        query += "WHERE ";
        query +=    "b.category_id=c.id AND ";
        query +=    "b.category_id in ( ";

        for(var i = 0 ; i < category_ids.length ; i++){
            if(i != category_ids.length - 1 ) query += category_ids[i] + ", ";
            else query += category_ids; 
        }
        query +=    " ) AND ";
        query +=    "status=1 AND ";
        query +=    "is_approved=1";

        try{
            const result = await db.query(query);
            return result;
        }
        catch(err){
            logger.error(err);
            return (err);
        }
    },
    
    // API용
    getByKeyword : async (keyword) => {
        var query = "";
        query += "SELECT ";
        query +=    "b.id as id, title, c.name as category_name, m.name as member_name, price, member_id, is_approved, file ";
        query += "FROM ";
        query +=    "book b, ";
        query +=    "category c, ";
        query +=    "member m ";
        query += "WHERE ";
        query +=    "b.category_id=c.id AND ";
        query +=    "b.member_id=m.id AND ";
        query +=    "c.name LIKE ? OR ";
        query +=    "title LIKE ? OR ";
        query +=    "description LIKE ? OR ";
        query +=    "m.name LIKE ? AND ";
        query +=    "b.status=1 AND ";
        query +=    "is_approved=1";
        var params =[];
        for(var i = 0 ; i < 4 ; i++){
            params.push("%"+keyword+"%");
        }

        try{
            const result = await db.query(query, params);
            return result;
        }
        catch(err){
            logger.error(err);
            return err;
        }
    },
    // ADMIN & API 용
    removeById : async (id) => {

        var query  = "";
        query += "UPDATE ";
        query +=    "book ";
        query += "SET ";
        query +=    "status=? ";
        query += "WHERE ";
        query +=    "id=? ";

        var params = [
            0, id
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
    
};
