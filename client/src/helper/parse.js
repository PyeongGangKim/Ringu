module.exports = {
    numberWithCommas: (x) => {
        try {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        } catch (e) {
            return 0;
        }



    },
    searchToDict: (search) => {
        var dict = {}
        //console.log(search.substring(1, search.length).split('&'))
        search.substring(1, search.length).split('&').map((s,n) => {


            var token = s.split('=')
            if(!(token[0] in dict) && !!token[0]) {
                dict[token[0]] = token[1]
            }
            else if(!!token[0]) {
                if(Array.isArray(dict[token[0]])) {
                    dict[token[0]].push(token[1])
                }
                else {
                    dict[token[0]] = [dict[token[0]], token[1]]                    
                }
            }
        })

        return dict
    },
    paramsToObject(entries) {
        const result = {}
        for(const [key, value] of entries) {
            result[key] = value;
        }

        return result
    }
}
