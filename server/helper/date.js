module.exports = {
    getDateTime: (date_from_db) => {
        var date = new Date(date_from_db);

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

        return year + month + day + hour + min + sec;
    },
    getDateFromDate: (date) => {

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + "-" + month + "-" + day;
    },

    getTimeFromDate: (date) => {

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        return hour + ":" + min + ":" + sec;
    },
    getDateTimeSnail: () => {
        var date = new Date();

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

        return year + "" + month + "" + day + "_" + hour + "" + min + "" + sec;
    },
    getDate: (date_from_db) => {
        var date = new Date(date_from_db);

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + "-" + month + "-" + day;
    },
    getTime: (date_from_db) => {
        var date = new Date(date_from_db);

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        return hour + ":" + min + ":" + sec;
    },
    getHM: (time_from_db) => {
        return time_from_db.substring(0, time_from_db.length-3);
    },
    addDays: (date, days) => {
        var date = new Date(date)
        date.setDate(date.getDate() + days)
        return date;
    },
    addMinutes: (date, mins) => {
        var date = new Date(date)
        date.setMinutes(date.getMinutes() + mins)
        return date;
    },
    compareDates:(date_1, date_2) => {
        const date1 = new Date(date_1);
        const date2 = new Date(date_2);
        const diffTime = date1 - date2;

        if(diffTime > 0)
            return 1;
        else if(diffTime == 0)
            return 0;
        else
            return -1;
    },
};
