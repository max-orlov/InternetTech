var RequestJsonHandler  = require('./requestJsonHandler'),
    RequestXformHandler  = require('./requestXformHandler'),
    serverSettings  = require('./../settings/settings');
function RequestBodyHandler() {
    return function (request, response, next) {
        if(request.is(serverSettings.serverVersion['json'])) {
            return RequestJsonHandler()(request, response, next);
        } else if (request.is(serverSettings.contentsTypes['xform'])) {
            return RequestXformHandler()(request, response, next);
        }
    };
}

module.exports = RequestBodyHandler;