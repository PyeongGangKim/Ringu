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
        return `${date.getFullYear().toString().substring(2,5)}. ${date.getMonth()+1}. ${date.getDate()}`
    }
}
