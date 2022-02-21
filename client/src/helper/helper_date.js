module.exports = {
    get_full_date_with_text: (datetime) => {
        var date = new Date(datetime);

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + "년 " + month + "월 " + day + "일 ";
    },
    get_full_date_hm_with_text: (datetime) => {
        var date = new Date(datetime);

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + "년 " + month + "월 " + day + "일 " + hour + "시 "+ min + "분";
    },
    diff_two_dates: (datetime_1, datetime_2) => {
        const date1 = new Date(datetime_1);
        const date2 = new Date(datetime_2);
        const diffTime = date2 - date1;
        //const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    compare_two_dates: (datetime_1, datetime_2) => {
        const date1 = new Date(datetime_1);
        const date2 = new Date(datetime_2);
        const diffTime = date1 - date2;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays < 0)
            return false;
        else {
            return true;
        }
    },
    subtract_date: (date, type, count) => {
        if(type === 'y'){
            return new Date(date.getFullYear()-count, date.getMonth(), date.getDate())
        } else if(type === 'm'){
            return new Date(date.getFullYear(), date.getMonth()-count, date.getDate())
        } else{
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()-count)
        }
    },
    add_date: (date, type, count) => {
        if(type === 'y'){
            return new Date(date.getFullYear()+count, date.getMonth(), date.getDate())
        } else if(type === 'm'){
            return new Date(date.getFullYear(), date.getMonth()+count, date.getDate())
        } else{
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()+count)
        }
    }
};
