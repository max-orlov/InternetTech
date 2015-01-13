/**
 * A handler for handling any request containing cookies - that is parsing cookies into the response.
 * @returns {Function} A handler for handling any request containing cookies.
 */
function RequestCookieHandler() {
    return function (request, response, next) {
        var cookies = request.cookies;
        if (cookies !== undefined) {
            for (var cookieHeader in cookies){
                response.cookie(cookieHeader, cookies[cookieHeader]);
            }
        }
        return next();
    }
}

module.exports = RequestCookieHandler;