module.exports = {
    numberWithCommas: (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
