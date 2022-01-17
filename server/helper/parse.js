module.exports = {
    get_param : (name) => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var c = url.searchParams.get(name);
        if (c == null) {
            return undefined;
        }
        return c;
    },
    url_encode : (key, val) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(val);
    }
};
