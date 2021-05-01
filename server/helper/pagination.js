var helper_parse = require("../helper/parse");

module.exports = {
    html : (base_url, current_page, limit_per_page, total_count, extra_params = {}) => {
        if (typeof current_page === 'undefined') current_page = 1;
        if (total_count == 0) return "";

        var urlencode = function(obj) {
            var str = [];
            for(var p in obj)
                str.push(helper_parse.url_encode(p, obj[p]));
            return str.join("&");
        };

        var fb_cnt  = 5;   // <------ 이게 전체 길이 말하는 거임~!!!!!!!!!!
        var limit   = Math.ceil(total_count/limit_per_page);
        var start   = (current_page < fb_cnt ) ? 1 : current_page - fb_cnt + 1;
        var end     = (current_page < fb_cnt ) ? current_page + (fb_cnt*2-1) : current_page + fb_cnt;
            end     = (end > limit) ? limit : end;
        var pages   = [];
        var double_front_arrow = true;
        var double_front_arrow_value = 0;
        var front_arrow = true;
        var front_arrow_value = 0;
        var back_arrow  = true;
        var back_arrow_value = 0;
        var double_back_arrow  = true;
        var double_back_arrow_value = 0;

        for (var i = start; i <= end; i++) {
            var item = { "num" : i, "cls" : "" };
            if (current_page == i)
                item.cls = "active";
            pages.push(item);
        }

        double_front_arrow_value = (current_page - fb_cnt > 0) ? current_page - fb_cnt : 1;
        front_arrow_value = ((current_page - 1) <= 0) ? 1 : (current_page - 1);
        back_arrow_value = ((current_page + 1) <= limit) ? (current_page + 1) : limit;
        double_back_arrow_value = (current_page + fb_cnt <= limit) ? current_page + fb_cnt : limit;

        var params = urlencode(extra_params);

        var html = "";
        html += '<ul class="pagination">';

        if (double_front_arrow) {
            html += '<li><a href="'+base_url + "?" + helper_parse.url_encode("page", double_front_arrow_value) + "&" + params+'">&#171;</a></li>';
        }

        if (double_front_arrow) {
            html += '<li><a href="'+base_url + "?" + helper_parse.url_encode("page", front_arrow_value) + "&" + params+'">&#8249;</a></li>';
        }

        for (var i = 0; i < pages.length; i++) {
            var item = pages[i];
            html += '<li class="'+item.cls+'"><a href="'+base_url + "?" + helper_parse.url_encode("page", item.num) + "&" + params+'">'+item.num+'</a></li>';
        }

        if (back_arrow) {
            html += '<li><a href="'+base_url + "?" + helper_parse.url_encode("page", back_arrow_value) + "&" + params+'">&#8250;</a></li>';
        }

        if (double_back_arrow) {
            html += '<li><a href="'+base_url + "?" + helper_parse.url_encode("page", double_back_arrow_value) + "&" + params+'">&#187;</a></li>';
        }

        html += '</ul>';

        return html;
    }
};
