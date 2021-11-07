module.exports = {
    format: (date) => {
        date = new Date(date)
        var day = date.getDay()
        switch(day) {
            case 0:
                day = "일"
                break;
            case 1:
                day = "월"
                break;
            case 2:
                day = "화"
                break;
            case 3:
                day = "수"
                break;
            case 4:
                day = "목"
                break;
            case 5:
                day = "금"
                break;
            case 6:
                day = "토"
                break;

        }
        return `${date.getFullYear().toString()}. ${date.getMonth()+1}. ${date.getDate()}`
    },

    fullFormat: (date) => {
        date = new Date(date)
        var day = date.getDay()
        switch(day) {
            case 0:
                day = "일"
                break;
            case 1:
                day = "월"
                break;
            case 2:
                day = "화"
                break;
            case 3:
                day = "수"
                break;
            case 4:
                day = "목"
                break;
            case 5:
                day = "금"
                break;
            case 6:
                day = "토"
                break;

        }
        return `${date.getFullYear().toString()}. ${date.getMonth()+1}. ${date.getDate()}. ${date.getHours()}:${date.getMinutes()}`
    },

    subtract: (date, type, count) => {
        if(type === 'y'){
            return new Date(date.getFullYear()-count, date.getMonth(), date.getDate())
        } else if(type === 'm'){
            return new Date(date.getFullYear(), date.getMonth()-count, date.getDate())
        } else{
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()-count)
        }
    },
}
