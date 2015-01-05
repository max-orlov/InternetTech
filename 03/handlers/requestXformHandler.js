var queryParser     = require('./../parser/queryparser'),
    serverSettings  = require('./../settings/settings');
function requestXformHandler() {
    return function (request, response, next) {
        if (request.is(serverSettings.contentsTypes['xform'])) {
            request.body = queryParser.parseQuery(request.rawBody);
        }
        return next();
    }
}

module.exports = requestXformHandler;