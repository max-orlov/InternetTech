var queryParser = require('./../parser/queryparser');


function requestRecordHandler() {
    return function (request, response, next) {
        if (!isEmpty(request.query)){
            require('fs').readFile('json_file','utf8',function(err,data){
                if (err){
                    console.log("error");
                    return;
                }
                return extractObjects(JSON.parse(data), request, response, next);
            });
        }
    }
}

function extractObjects(jsonFile, request, response, next){
    for (var fileKey in jsonFile){
        for (var requestKey in request.query){

        }
    }
}

module.exports = requestRecordHandler;