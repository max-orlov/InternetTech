var queryParser     = require('./../parser/queryparser'),
    serverSettings  = require('./../settings/settings'),
    mimeTypes       = require('./../settings/mimeTypes');
function RequestUrlEncodedHandler() {
    return function (request, response, next) {
        if (request.is(mimeTypes.getMimeType('xform'))) {
            request.body = queryParser.parseQuery(request.rawBody.trim());
        }
        return next();
    }
}

module.exports = RequestUrlEncodedHandler;