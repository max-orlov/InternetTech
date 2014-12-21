var url             = require('url'),
    Request         = require("./request"),
    serverSettings  = require('./settings');

exports.parse = function (requestStr) {
    var request = new Request();

    //TODO:: pay attention that you and the browser should use the content-length header in order to recognize the end of the body of the Response/response).
    //TODO:: You can assume that when an http Response contains a body, it contains a content-length header that specifies the length of the body.
    request.body =  requestStr.substr(requestStr.indexOf(serverSettings.CRLF + serverSettings.CRLF) , requestStr.length).trim();
    requestStr.replace(requestStr.indexOf(serverSettings.CRLF + serverSettings.CRLF), request.body.length,"");

    var textContent = requestStr.split(serverSettings.CRLF);
    var type = textContent[0].trim();
    var typeContent = type.split(' ');
    var urlPath = url.parse(typeContent[1].trim(), true);
    request.method = typeContent[0].trim();
    request.path = urlPath.pathname;
    request.version = typeContent[2].trim();

    if (request.method === serverSettings.HTTP_METHODS.GET || request.method === serverSettings.HTTP_METHODS.HEAD) {
        request.params = urlPath.query;
    } else {
        //TODO:: Extract POST parameters.
        request.params = '';
    }

    delete textContent[0];

    for (var index in textContent){
        var line = textContent[index].trim();
        if (line != '')
            request.headers[line.substr(0, line.indexOf(':')).trim()] = line.substr(line.indexOf(':') + 1).trim();
    }
    return request;
};

exports.stringify = function (response) {
    var responseStr = "";

    responseStr += response.version + " " + response.status + " " + serverSettings.STATUS_CODES[response.status] + serverSettings.CRLF;
    for (var key in response.headers){
        responseStr += key + ":" + response.headers[key] + serverSettings.CRLF;
    }
    responseStr += serverSettings.CRLF;
    return responseStr;
};