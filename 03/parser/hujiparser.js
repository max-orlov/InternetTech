var url             = require('url'),
    debug           = require('./../debugging/debug'),
    serverSettings  = require('./../settings/settings');


function parse(requestStr, request) {
    try {
        request.rawData += requestStr;

        if (request.status == request.requestStatus.initialized)
            separateMethod(request);
        if (request.status == request.requestStatus.separateMethod)
            parseMethod(request);
        if (request.status == request.requestStatus.parseMethod)
            validateMethod(request);
        if (request.status == request.requestStatus.validateMethod)
            separateHeaders(request);
        if (request.status == request.requestStatus.separatedHeaders)
            parseHeaders(request);
        if (request.status == request.requestStatus.parsedHeaders)
            validateHeaders(request);
        if (request.status == request.requestStatus.validatedHeaders)
            parseBody(request);

        return request;

    } catch (e) {
        request.status = request.requestStatus.errorParsing;
        request.messageError = e.message + serverSettings.CRLF;
    }
}

function separateMethod(request) {
    for (var i = request.parseIndex ; i < request.rawData.length ; i++){
        if ((request.rawData[i] === serverSettings.CR) && (request.rawData[i + 1] === serverSettings.LF)) {
            request.rawMethod = request.rawData.slice(request.parseIndex, i);
            request.status = request.requestStatus.separateMethod;
            request.parseIndex += i + 1;
            return;
        }
    }
    request.statusCode = 500;
    throw new Error("There is no initial line");
}

function parseMethod(request) {
    var methodContent = request.rawMethod.split(' ');

    if (methodContent.length != 3) {
        request.statusCode = 500;
        throw new Error("Parsing Error: Request initial line syntax is invalid");
    }

    var urlPath = url.parse(methodContent[1], true);

    request.method = methodContent[0].trim();
    request.path = urlPath.pathname;
    request.httpVersion = methodContent[2].trim();

    if (request.method === serverSettings.httpMethods.GET || request.method === serverSettings.httpMethods.HEAD) {
        request.params = urlPath.query;
    } else {
        request.params = '';
    }
    request.status = request.requestStatus.parseMethod;
}

function validateMethod(request) {
    if (request.httpVersion !== serverSettings.httpSupportedVersions['1.0'] && request.httpVersion !== serverSettings.httpSupportedVersions['1.1']) {
        request.statusCode = 500;
        throw new Error("HTTP version is not supported");
    }

    if (!(request.method in serverSettings.httpMethods)) {
        request.statusCode = 500;
        throw new Error("The required method is not supported");
    }
    request.status = request.requestStatus.validateMethod;
}

function separateHeaders(request) {
    for (var i = request.parseIndex; i < request.rawData.length ; i++) {
        if ((request.rawData[i] === serverSettings.CR) && (request.rawData[i + 1] === serverSettings.LF)) {
            if ((i < request.rawData.length - 3)) {
                if ((request.rawData[i + 2] === serverSettings.CR) && (request.rawData[i + 3] === serverSettings.LF)) {
                    request.rawHeaders = request.rawData.slice(request.parseIndex, i);
                    request.headersEnd = i + 3;
                    request.status = request.requestStatus.separatedHeaders;
                    request.parseIndex = request.headersEnd;
                }
            }
        }
    }

    return 0;
}

function parseHeaders(request) {
    var headersContent = request.rawHeaders.split(serverSettings.CRLF);
    for (var index in headersContent) {
        var line = headersContent[index].trim();
        if (line != '') {
            var separator = line.indexOf(":");
            if (separator === -1) {
                request.statusCode = 500;
                throw new Error("Parsing Error: Headers does not contain ':' separator");
            }
            request.headers[line.substr(0, separator).trim().toLowerCase()] = line.substr(separator + 1).trim();
        }
    }
    request.status = request.requestStatus.parsedHeaders;
}

function validateHeaders(request) {
    if (request.httpVersion === serverSettings.httpSupportedVersions['1.1']) {
        if (!("host" in request.headers)) {
            request.statusCode = 500;
            throw new Error("HTTP version is v1.1 and doesn't contain 'host' key");
        }
    }
    request.status = request.requestStatus.validatedHeaders;

}

function parseBody(request) {
    if ('content-length' in request.headers) {
        var contentLength = parseInt(request.headers['content-length']);
        var body = request.rawData.slice(request.parseIndex + 1, request.headersEnd + 1 + contentLength);
        request.body += body;
        request.parseIndex += body.length;
        if (request.body.length >= contentLength) {
            request.status = request.requestStatus.done;
        }
    } else {
        request.body = "";
        request.status =  request.requestStatus.done;
    }
}

function stringify(response) {
    var responseStr = "";

    responseStr += response.httpVersion + " " + response.statusCode + " " + serverSettings.statusCodes[response.statusCode] + serverSettings.CRLF;
    for (var key in response.headers) {
        responseStr += key + ":" + response.headers[key] + serverSettings.CRLF;
    }
    return responseStr + serverSettings.CRLF;
}


exports.parse = parse;
exports.stringify = stringify;