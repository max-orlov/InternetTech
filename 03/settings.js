exports.SERVER_VERSION = 'v0.10.33';

exports.CRLF = '\r\n';

exports.CONTENT_TYPES={
    js: 'application/javascript',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    png: 'image/png'
};

exports.STATUS_CODES = {
    200 : 'OK',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    500 : 'Parsing Error',
    505 : 'HTTP Version not supported'
};

exports.ENCODING = 'utf-8';

exports.HTTP_METHODS = {
    GET : 'GET',
    POST : 'POST',
    HEAD : 'HEAD'
};

exports.LAST_REQUEST_TIMEOUT_SEC = 2;

exports.HTTP_SUPPORTED_VERSION = 'HTTP/1.1';

exports.HOST_ADDRESS = 'localhost';
