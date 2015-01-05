var serverSettings  = require('./../settings/settings');


function requestRecordHandler() {
    return function (request, response, next) {
            require('fs').readFile('json_file','utf8',function(err,data){
                if (err){
                    console.log("error");
                    return;
                }
                extractObjects(JSON.parse(data), request, response, next);
            });
    }
}

function extractObjects(jsonResource, request, response, next){
    response.body = {}
    for (var key in jsonResource){
        if (keysCheckupHelper(jsonResource[key], request.query[key])){
            response.body[key] = jsonResource[key]
            //break;
        }
    }
    console.log(response.body);
    //response.body = JSON.stringify(jsonObjects);
    //console.log(response.body)
    next();
}

function keysCheckupHelper(resourceJson, requestJson){
    if (resourceJson === requestJson){
        return true;
    }
    else
    for (var requestKey in requestJson)
        if (resourceJson.hasOwnProperty(requestKey))
            if (resourceJson[requestKey] === requestJson[requestKey]) {
                if (typeof requestJson[requestKey] === 'object') {
                    for (var innerKey in requestJson[requestKey])
                        return keysCheckupHelper(resourceJson[innerKey], requestJson[innerKey])
                }
                return true;
            }
    return false;
}

module.exports = requestRecordHandler;