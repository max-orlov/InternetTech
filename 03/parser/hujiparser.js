var url             = require('url'),
    serverSettings  = require('./../settings/settings');

function parse(requestStr, request) {
    request.rawData += requestStr;
    request.parseIndex += requestStr.length;

    if(request.status === request.requestStatus.initialized) {
        separateHeaders(request);
    }
    if (request.status === request.requestStatus.separatedHeaders) {
        parseHeaders(request);
    }

    if (request.status === request.requestStatus.parsedHeaders) {
        validateHeaders(request);
    }

    if (request.status === request.requestStatus.validatedHeaders) {
        parseBody(request);
    }

    return request;
}

function separateHeaders(request) {
    for (var i = 0; i < request.parseIndex ; i++) {
        if ((request.rawData[i] === serverSettings.CR) && (request.rawData[i + 1] === serverSettings.LF)) {
            if ((i < request.rawData.length - 3)) {
                if ((request.rawData[i + 2] === serverSettings.CR) && (request.rawData[i + 3] === serverSettings.LF)) {
                    request.rawHeaders = request.rawData.slice(0, i);
                    request.headersEnd = i + 3;
                    request.status = request.requestStatus.separatedHeaders;
                    request.parseIndex += request.headersEnd;
                }
            }
        }
    }

    return 0;
}

function parseHeaders(request) {
    var headersContent = request.rawHeaders.split(serverSettings.CRLF);
    var type = headersContent[0].trim();
    var typeContent = type.split(' ');

    var urlPath = url.parse(typeContent[1], true);


    if(typeContent.length != 3) {
        request.status = 500;
        throw new Error("Parsing Error: Request initial line syntax is invalid");
    }

    request.method = typeContent[0].trim();
    request.path = urlPath.pathname;
    request.httpVersion = typeContent[2].trim();

    if (request.method === serverSettings.HTTP_METHODS.GET || request.method === serverSettings.HTTP_METHODS.HEAD) {
        request.params = urlPath.query;
    } else {
        //TODO:: Extract POST parameters.
        request.params = '';
    }

    //TODO: Find a better way deleting the method line. maybe parsing apart.
    delete headersContent[0];
    for (var index in headersContent){
        var line = headersContent[index].trim();
        if (line != '') {
            var separator = line.indexOf(":");
            if (separator === -1) {
                request.status = 500;
                throw new Error("Parsing Error: Headers does not contain ':' separator");
            }
            request.headers[line.substr(0, separator).trim().toLowerCase()] = line.substr(separator + 1).trim();
        }
    }
    request.status = request.requestStatus.parsedHeaders;
}

function validateHeaders(request) {

    if (request.httpVersion !== serverSettings.HTTP_SUPPORTED_VERSIONS['1.0'] && request.httpVersion !== serverSettings.HTTP_SUPPORTED_VERSIONS['1.1']){
        request.status = 505;
        throw new Error("HTTP version is not supported");
    }

    if (request.httpVersion === serverSettings.HTTP_SUPPORTED_VERSIONS['1.1']) {
        if (!("host" in request.headers)) {
            request.status = 500;
            throw new Error("HTTP version is v1.1 and doesn't contain 'host' key");
        }
    }

    if (!(request.method in serverSettings.HTTP_METHODS)) {
        request.status = 405;
        throw new Error("The required method is not supported");
    }
    request.status = request.requestStatus.validatedHeaders;

}

function parseBody(request) {
    if ('content-length' in request.headers) {
        var contentLength = parseInt(request.headers['content-length']);
        var body = request.rawData.slice(request.parseIndex + 1, request.headersEnd + 1 + contentLength);
        request.body += body;
        request.parseIndex += body.length;
        if(request.body.length == contentLength) {
            request.status = request.requestStatus.done;
        }
    } else {
        request.body = "";
        request.status =  request.requestStatus.done;
    }
}


function stringify(response) {
    var responseStr = "";

    responseStr += response.httpVersion + " " + response.status + " " + serverSettings.STATUS_CODES[response.status] + serverSettings.CRLF;
    for (var key in response.headers){
        responseStr += key + ":" + response.headers[key] + serverSettings.CRLF;
    }
    return responseStr + serverSettings.CRLF;
}


exports.parse = parse;
exports.stringify = stringify;