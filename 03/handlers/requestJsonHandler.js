var serverSettings  = require('./../settings/settings');

function RequestJsonHandler() {
    return function (request, response, next) {
        if (request.is(serverSettings.contentsTypes['json'])) {
            if (request.rawBody.length > 0) {
                var body = JSON.parse(request.rawBody.trim());
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