const dontKnowTypeStringOrNumber = (a,b) =>{
    if(typeof a === typeof b){
        return ( a === b) ? true : false;
    }
    else{
        a = Number(a);
        b = Number(b);
        return ( a === b) ? true : false;
    }
}

module.exports = {
    dontKnowTypeStringOrNumber : dontKnowTypeStringOrNumber
}