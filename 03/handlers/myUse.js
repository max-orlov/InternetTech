var path = require('path'),
    fs = require('fs'),
    serverSettings = require('./../settings/settings');

/**
 * A built-in record handler for JSON queries
 * @returns {Function}
 */
function myUse(rootDir) {
    return function (request, response, next) {
        var root;
        if (rootDir == undefined){
            root = __dirname
        }
        else{
            root = rootDir;
        }
        var normPath =  path.join(root + '\\..', response.path);
        fs.readFile(normPath, 'utf8', function (err, data) {
            if (err) {
                console.log("error");
            }
            else{
                if (request.method == serverSettings.httpMethods.GET) {
                    response.body = extractObjects(JSON.parse(data), request.query)[0];
                }
                else if (request.method == serverSettings.httpMethods.POST){
                    response.body = extractObjects(JSON.parse(data), request.body)[0];
                }

                response.send(response.body);
                return next();
            }
        });
    }
}

// TODO : implement
myUse.toString = function(){
    return  "This handler handles a query both in GET and POST format for a record in some " +
            "JSON file spcified by the path. For example if you'd like to retrieve the record " +
            "of a person with id=123 from the file people, all the client needs to do is the " +
            "following '/people?id=123' in the path. You can specify the rootfolder or leave it " +
            "blank, and the root folder of the handler will be used."
}

/**
 * A helper function which helps find the exact path of the query
 * @param jsonRes the json resource to check
 * @param jsonReq the request itself
 */
function extractObjects(jsonRes, jsonReq) {
    var objects = [];
    for (var key in jsonReq) {
        if (jsonReq.hasOwnProperty(key)) {
            objects.push(getObjects(jsonRes, key, jsonReq[key]));
        }
    }
    return objects;
}

/**
 * A recursive helper function which searches the specified key and val in the object
 * @param resObject the objects to search in
 * @param key the key to search for
 * @param val the val for that key
 * @returns {Array} an array of objects
 */
function getObjects(resObject, key, val) {
    var objects = [];
    for (var i in resObject) {
        if (!resObject.hasOwnProperty(i)) {
            continue;
        }
        if (typeof resObject[i] == 'object') {
            objects = objects.concat(getObjects(resObject[i], key, val));
        } else if (i == key && resObject[key] == val) {
            objects.push(resObject);
        }
    }
    return objects;
}


module.exports = myUse;