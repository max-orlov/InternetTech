var path            = require('path');

/**
 * A build in record handler for JSON querys
 * @returns {Function}
 */
function RequestRecordHandler() {
    return function (request, response, next) {
        var normPath =  path.join(__dirname + '\\..', response.path);
        require('fs').readFile(normPath,'utf8',function(err,data){
                if (err){
                    console.log("error");
                    return;
                }
                else{
                    response.body = extractObjects(JSON.parse(data), request.query)[0];
                    response.send(response.body);
                    next();
                }
            });
    }
}

/**
 * A helper function which helps find the exact path of the query
 * @param jsonResource the json resource to check
 * @param request the request itself
 * @param response the response itself.
 */
function extractObjects(jsonRes, jsonReq){
    var objects = [];
    for (var key in jsonReq) {
        objects.push(getObjects(jsonRes, key, jsonReq[key]));
    }
    return objects;
}

/**
 * A recursive helper function which searches the sepcified key and val in the object
 * @param resObject the objects to search in
 * @param key the key to search for
 * @param val the val for that key
 * @returns {Array} an array of objects
 */
function getObjects(resObject, key, val) {
    var objects = [];
    for (var i in resObject) {
        if (!resObject.hasOwnProperty(i)) continue;
        if (typeof resObject[i] == 'object') {
            objects = objects.concat(getObjects(resObject[i], key, val));
        } else if (i == key && resObject[key] == val) {
            objects.push(resObject);
        }
    }
    return objects;
}


module.exports = RequestRecordHandler;