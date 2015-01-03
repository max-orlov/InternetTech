var Settings = {
    hostAddress             : 'localhost',
    serverVersion           : 'node.js v0.10.33',
    encoding                : 'utf-8',
    maxTimeout              : 2000,
    CR                      : '\r',
    LF                      : '\n',
    CRLF                    : '\r\n',
    pageNotFoundPath   : '/tests/404.html',
    contentsTypes           : {
        js      : 'application/javascript',
        txt     : 'text/plain',
        html    : 'text/html',
        css     : 'text/css',
        jpg     : 'image/jpeg',
        jpeg    : 'image/jpeg',
        gif     : 'image/gif',
        png     : 'image/png',
        ico     : 'image/x-ico',
        buffer  : 'application/octet-stream'
    },
    statusCodes             : {
        200     : 'OK',
        404     : 'Not Found',
        405     : 'Method Not Allowed',
        500     : 'Parsing Error',
        501     : 'Not Implemented',
        505     : 'HTTP Version not supported'
    },
    httpMethods             : {
        GET     : 'GET',
        POST    : 'POST',
        HEAD    : 'HEAD',
        PUT     : 'PUT',
        DELETE  : 'DELETE'
    },
    httpSupportedVersions   : {
        "1.0"   : 'HTTP/1.0',
        "1.1"   : 'HTTP/1.1'
    },
    hasContentType          : function (value) {
        for(var key in this.contentsTypes) {
            if(this.contentsTypes.hasOwnProperty(key)) {
                if(this.contentsTypes[key] === value) {
                    return true
                }
            }
        }
        return false;
    }
};

module.exports = Settings;



