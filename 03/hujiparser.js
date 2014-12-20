var url             = require('url'),
    serverSettings  = require('./settings'),
    requestHandlers = require('./requestHandlers');

exports.parse = function (httpRequestStr) {
    var httpRequestObject = new requestHandlers.HttpRequestObject();

    //TODO:: pay attention that you and the browser should use the content-length header in order to recognize the end of the body of the request/response).
    //TODO:: You can assume that when an http request contains a body, it contains a content-length header that specifies the length of the body.
    httpRequestObject.body =  httpRequestStr.substr(httpRequestStr.indexOf(serverSettings.CRLF + serverSettings.CRLF) , httpRequestStr.length).trim();
    httpRequestStr.replace(httpRequestStr.indexOf(serverSettings.CRLF + serverSettings.CRLF), httpRequestObject.body.length,"");

    var textContent = httpRequestStr.split(serverSettings.CRLF);
    var type = textContent[0].trim();
    var typeContent = type.split(' ');
    var urlPath = url.parse(typeContent[1].trim(), true);
    httpRequestObject.method = typeContent[0].trim();
    httpRequestObject.path = urlPath.pathname;
    httpRequestObject.version = typeContent[2].trim();

    if (httpRequestObject.method === serverSettings.HTTP_METHODS.GET || httpRequestObject.method === serverSettings.HTTP_METHODS.HEAD) {
        httpRequestObject.params = urlPath.query;
    } else {
        //TODO:: Extract POST parameters.
        httpRequestObject.params = '';
    }

    delete textContent[0];

    for (var index in textContent){
        var line = textContent[index].trim();
        if (line != '')
            httpRequestObject.headers[line.substr(0, line.indexOf(':')).trim()] = line.substr(line.indexOf(':') + 1).trim();
    }
    return httpRequestObject;
};

exports.stringify = function (httpResponseObject) {
    var httpResponseStr = "";

    httpResponseStr += httpResponseObject.version + " " + httpResponseObject.status + " " + serverSettings.STATUS_CODES[httpResponseObject.status] + serverSettings.CRLF;
    for (var key in httpResponseObject.headers){
        httpResponseStr += key + ":" + httpResponseObject.headers[key] + serverSettings.CRLF;
    }
    httpResponseStr += serverSettings.CRLF;
    return httpResponseStr;
};