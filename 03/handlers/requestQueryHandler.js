var queryParser = require('./../parser/queryparser');

function requestQueryHandler() {
    return function (request, response, next) {
        request.query = queryParser.parseQuery(request.rawQuery);
        return next();
    }
}

module.exports = requestQueryHandler();