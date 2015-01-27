var RequestJsonHandler          = require('./requestJsonHandler'),
    RequestUrlEncodedHandler    = require('./requestUrlEncodedHandler'),
    mimeTypes                   = require('./../settings/mimeTypes');
function RequestBodyHandler() {
    return function (request, response, next) {
        if (request.is(mimeTypes.getMimeType('json'))) {
            return RequestJsonHandler()(request, response, next);
        } else if (request.is(mimeTypes.getMimeType('xform'))) {
            return RequestUrlEncodedHandler()(request, response, next);
        }
        return next();
    };
}

module.exports = RequestBodyHandler;