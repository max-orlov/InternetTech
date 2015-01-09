/**
 * Gets an object and returns a copy of the object except that the new object keys are lower-case.
 * @param obj given object.
 * @returns {{}} a copy of the object except that the new object keys are lower-case.
 */
function objKeysToLowerCase(obj) {
    var newObj = {};
    Object.keys(obj).forEach(function(key){
        var k = key.toLowerCase();
        newObj[k] = obj[key];
    });
    return newObj;
}

exports.objKeysToLowerCase = objKeysToLowerCase;