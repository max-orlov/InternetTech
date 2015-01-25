var mimeTypes = require('./../settings/mimeTypes');

function RequestJsonHandler() {
    return function (request, response, next) {
        if (request.is(mimeTypes.getMimeType('json'))) {
            if (request.body.length > 0) {
                var body = JSON.parse(request.body.trim());
                if (typeof body === 'object') {
                    request.body = body;
                } else {
                    throw new Error("invalid body structure");
                }
            }
        }
        return next();
    }
}

module.exports = RequestJsonHandler;