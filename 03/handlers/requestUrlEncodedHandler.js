var queryParser     = require('./../parser/queryparser'),
    serverSettings  = require('./../settings/settings');
function RequestUrlEncodedHandler() {
    return function (request, response, next) {
        if (request.is(serverSettings.contentsTypes['xform'])) {
            request.body = queryParser.parseQuery(request.rawBody.trim());
        }
        return next();
    }
}

module.exports = RequestUrlEncodedHandler;