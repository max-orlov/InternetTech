var queryParser     = require('./../parser/queryparser'),
    mimeTypes       = require('./../settings/mimeTypes');
function RequestUrlEncodedHandler() {
    return function (request, response, next) {
        if (request.is(mimeTypes.getMimeType('xform'))) {
            request.body = queryParser.parseQuery(request.body.trim());
        }
        return next();
    }
}

module.exports = RequestUrlEncodedHandler;