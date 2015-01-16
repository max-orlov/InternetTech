var serverSettings  = require('./../settings/settings'),
    mimeTypes       = require('./../settings/mimeTypes'),
    queryParser     = require('./queryparser');

/**
 * Parses an HTTP request string into an HTTP request object.
 * @param requestStr HTTP request string.
 * @param request HTTP request object.
 * @returns {*} HTTP request object.
 */
function parse(requestStr, request) {
    try {
        request.rawData += requestStr;
        if (request.status === request.requestStatus.initialized)
            separateMethod(request);
        if (request.status === request.requestStatus.separateMethod)
            parseMethod(request);
        if (request.status === request.requestStatus.parseMethod)
            validateMethod(request);
        if (request.status === request.requestStatus.validateMethod)
            separateHeaders(request);
        if (request.status === request.requestStatus.separatedHeaders)
            parseHeaders(request);
        if (request.status === request.requestStatus.parsedHeaders)
            validateHeaders(request);
        if (request.status === request.requestStatus.validatedHeaders)
            parseBody(request);

        return request;

    } catch (e) {
        request.status = request.requestStatus.errorParsing;
        request.messageError = e.message + serverSettings.CRLF;
    }
}

/**
 * Separates the initial line from the request.
 * @param request HTTP request object.
 */
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

/**
 * Parses the initial line of the request.
 * @param request HTTP request object.
 */
function parseMethod(request) {
    var methodContent = request.rawMethod.split(' ');

    //initial line form is invalid.
    if (methodContent.length !== 3) {
        request.statusCode = 500;
        throw new Error("Parsing Error: Request initial line syntax is invalid");
    }

    //catch the first question mark in the url and separates it into urlPath and urlQuery.
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
    request.query = request.method == serverSettings.httpMethods.GET ? queryParser.parseQuery(urlQuery) : {};
    request.status = request.requestStatus.parseMethod;
}

/**
 * Performs validation of the initial line.
 * @param request HTTP request object.
 */
function validateMethod(request) {

    //check if the given http version is supported.
    if (request.httpVersion !== serverSettings.httpSupportedVersions['1.0'] &&
        request.httpVersion !== serverSettings.httpSupportedVersions['1.1']) {
        request.statusCode = 505;
        throw new Error("HTTP version is not supported");
    }

    //checks if the given http method is supported.
    if (!(request.method in serverSettings.httpMethods)) {
        request.statusCode = 501;
        throw new Error("The required method is not supported");
    }
    request.status = request.requestStatus.validateMethod;
}

/**
 * Separates the headers from the request. in order to do so, looks for double CRLF.
 * @param request HTTP request object.
 */
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

/**
 * Parses the headers of the request.
 * @param request HTTP request object.
 */
function parseHeaders(request) {
    var headersContent = request.rawHeaders.split(serverSettings.CRLF);
    for (var index in headersContent) {
        if(headersContent.hasOwnProperty(index)) {
            var line = headersContent[index].trim();
            //the form of the headers is invalid.
            if (line !== '') {
                var separator = line.indexOf(":");
                if (separator === -1) {
                    request.statusCode = 500;
                    throw new Error("Parsing Error: Headers does not contain ':' separator");
                }
                request.headers[line.substr(0, separator).trim().toLowerCase()] = line.substr(separator + 1).trim();
            }
        }
    }

    // Parse the cookie
    var cookie = request.get('cookie');
    if (cookie !== undefined) {
        var cookieCouples = cookie.split(/;/g);
        for (var i = 0; i < cookieCouples.length; i++) {
            var couple = cookieCouples[i].split(/=/g);
            if (couple.length !== 2) {
                request.statusCode = 500;
                throw new Error("Cookie format is invalid");
            }
            request.cookies[couple[0].trim()] = couple[1].trim();
        }
    }

    request.host = request.get('host');


    request.status = request.requestStatus.parsedHeaders;
}


/**
 * Perform validation of the headers.
 * @param request HTTP request object.
 */
function validateHeaders(request) {
    //checks if the given request is v 1.1 and contains an host header.
    if (request.httpVersion === serverSettings.httpSupportedVersions['1.1']) {
        if (!("host" in request.headers)) {
            request.statusCode = 500;
            throw new Error("HTTP version is v1.res and doesn't contain 'host' key");
        }
    }
    request.status = request.requestStatus.validatedHeaders;

}


/**
 * Parses the body of the request.
 * @param request HTTP request object.
 */
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

    // If the body is of input type, parse it into
    if(request.is(mimeTypes.getMimeType('json'))) {
        if (request.rawBody.length > 0) {
            body = JSON.parse(request.rawBody.replace("'",'"').trim());
            if (typeof body === 'object') {
                request.body = body;
            } else {
                throw new Error("invalid body structure");
            }
        }
    } else if (request.is(mimeTypes.getMimeType('xform'))) {
        request.body = queryParser.parseQuery(request.rawBody.trim());
    }

}


/**
 * Return the string representation of a given HTTP response object. (without the body).
 * @param response HTTP response object.
 * @returns {string} string the string representation of a given HTTP response object.
 */
function stringify(response) {
    var responseStr = "";

    responseStr += response.httpVersion + " " + response.statusCode + " " +
    response.statusText === null ? serverSettings.statusCodes[response.statusCode] : response.statusText
    + serverSettings.CRLF;
    //iterates over the headers
    for (var key in response.headers) {
        if (response.headers.hasOwnProperty(key)) {
            //if the header value is an array (set-cookie case), iterates over the array values.
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
