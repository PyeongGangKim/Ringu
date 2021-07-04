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
        search.substring(1, search.length).split('&').map(s => {
            var token = s.split('=')
            dict[token[0]] = token[1]
        })

        return dict
    }
}
