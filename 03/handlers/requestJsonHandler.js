var queryParser     = require('./../parser/queryparser'),
    serverSettings  = require('./../settings/settings');
function requestJsonHandler() {
    return function (request, response, next) {
        //TODO:: handle request the it's body is json
        return next();
    }
}

module.exports = requestJsonHandler;