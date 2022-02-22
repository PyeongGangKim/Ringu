module.exports = {
    numberWithCommas: (x) => {
        try {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        } catch (e) {
            return 0;
        }
    },
    paramsToObject(entries) {
        const result = {}
        for(const [key, value] of entries) {
            result[key] = value;
        }

        return result
    },
}
