module.exports = {
    response: (res, payload) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(payload));
    },
    missing: (res, name) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ "code" : 444, "message" : "missing required field '" + name + "'"}));
    },
    required: (req, names, return_name = false) => {
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (name in req.body)
                continue;
            if (return_name) {
                return name;
            } else {
                return false;
            }
        }
        return true;
    }
};
