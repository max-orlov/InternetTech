var RequestJsonHandler          = require('./requestJsonHandler'),
    RequestUrlEncodedHandler    = require('./requestUrlEncodedHandler'),
    serverSettings              = require('./../settings/settings'),
    mimeTypes                   = require('./../settings/mimeTypes');
function RequestBodyHandler() {
    return function (request, response, next) {
        if(request.is(serverSettings.serverVersion['json'])) {
            return RequestJsonHandler()(request, response, next);
        } else if (request.is(mimeTypes.getMimeType('xform'))) {
            return RequestUrlEncodedHandler()(request, response, next);
        }
    };
}

module.exports = RequestBodyHandler;