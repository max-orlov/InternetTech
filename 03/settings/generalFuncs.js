function objKeysToLowerCase(obj) {
    var newObj = {};
    Object.keys(obj).forEach(function(key){
        var k = key.toLowerCase();
        newObj[k] = obj[key];
    });
    return newObj;
}

exports.objKeysToLowerCase = objKeysToLowerCase;