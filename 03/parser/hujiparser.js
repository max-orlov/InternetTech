var serverSettings  = require('./../settings/settings'),
    queryParser     = require('./queryparser');

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
        if ((request.rawData[i] === serverSettings.CR) &&
            (request.rawData[i + 1] === serverSettings.LF)) {

            request.rawMethod = request.rawData.slice(request.parseIndex, i);
            request.status = request.requestStatus.separateMethod;
            request.parseIndex += i + 1;
            return;
        }
    }
    request.statusCode = 500;
    throw new Error("Parsing Error: There is no initial line");
}

function parseMethod(request) {
    var methodContent = request.rawMethod.split(' ');

    if (methodContent.length != 3) {
        request.statusCode = 500;
        throw new Error("Parsing Error: Request initial line syntax is invalid");
    }

    var fullPath = methodContent[1].trim();
    var firstQuestionMarkIndex = fullPath.indexOf('?');
    if (firstQuestionMarkIndex !== -1) {
        var urlPath = fullPath.substring(0, firstQuestionMarkIndex);
        var urlQuery = fullPath.substring(firstQuestionMarkIndex + 1);
    } else {
        urlPath = fullPath;
        urlQuery = "";
    }

    request.method = methodContent[0].trim();
    request.path = urlPath;
    request.httpVersion = methodContent[2].trim();
    request.query = urlQuery ? queryParser.parseQuery(urlQuery) : {};
    request.status = request.requestStatus.parseMethod;
}

function validateMethod(request) {
    if (request.httpVersion !== serverSettings.httpSupportedVersions['1.0'] &&
        request.httpVersion !== serverSettings.httpSupportedVersions['1.1']) {
        request.statusCode = 505;
        throw new Error("HTTP version is not supported");
    }

    if (!(request.method in serverSettings.httpMethods)) {
        request.statusCode = 501;
        throw new Error("The required method is not supported");
    }
    request.status = request.requestStatus.validateMethod;
}

function separateHeaders(request) {
    for (var i = request.parseIndex; i < request.rawData.length ; i++) {
        if ((request.rawData[i] === serverSettings.CR) &&
            (request.rawData[i + 1] === serverSettings.LF)) {

            if ((i < request.rawData.length - 3)) {

                if ((request.rawData[i + 2] === serverSettings.CR) &&
                    (request.rawData[i + 3] === serverSettings.LF)) {
                    request.rawHeaders = request.rawData.slice(request.parseIndex, i);
                    request.headersEnd = i + 3;
                    request.status = request.requestStatus.separatedHeaders;
                    request.parseIndex = request.headersEnd;
                    break;
                }
            }
        }
    }
}

function parseHeaders(request) {
    var headersContent = request.rawHeaders.split(serverSettings.CRLF);
    for (var index in headersContent) {
        if(headersContent.hasOwnProperty(index)) {
            var line = headersContent[index].trim();
            if (line != '') {
                var separator = line.indexOf(":");
                if (separator === -1) {
                    request.statusCode = 500;
                    throw new Error("Parsing Error: Headers does not contain ':' separator");
                }
                request.headers[line.substr(0,
                    separator).trim().toLowerCase()] = line.substr(separator + 1).trim();
            }
        }
    }
    request.host = request.get('host');
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
        var body = request.rawData.slice(request.parseIndex + 1,
            request.headersEnd + 1 + contentLength);

        request.rawBody += body;
        request.parseIndex += body.length;
        if (request.rawBody.length >= contentLength) {
            request.status = request.requestStatus.done;
        }
    } else {
        request.rawBody = "";
        request.status =  request.requestStatus.done;
    }
}

function stringify(response) {
    var responseStr = "";

    responseStr += response.httpVersion + " " + response.statusCode + " " +
    serverSettings.statusCodes[response.statusCode] + serverSettings.CRLF;
    for (var key in response.headers) {
        if (response.headers.hasOwnProperty(key)) {
            if (Array.isArray(response.headers[key])) {
                for (var i = 0; i < response.headers[key].length; i++) {
                    responseStr += key + ":" + response.headers[key][i] + serverSettings.CRLF;
                }
            }
            else {
                responseStr += key + ":" + response.headers[key] + serverSettings.CRLF;
            }
        }
    }
    return responseStr + serverSettings.CRLF;
}



exports.parse = parse;
exports.stringify = stringify;