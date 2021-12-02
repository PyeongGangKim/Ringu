const checkNullAndUndefined = (a) => {
    if(a === null || a === undefined) return true;
    else return false;
}

module.exports = {
    checkNullAndUndefined: checkNullAndUndefined
}