const makeNewPassowrd = (pwdLength) => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*";
    let charactersLength = characters.length;
    let newPwd = "";
    for(let i = 0 ; i < pwdLength ; i++){
        newPwd += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return newPwd;
}

module.exports = {
    makeNewPassowrd : makeNewPassowrd
};