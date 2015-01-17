/**
 * A handler for handling any request containing cookies - that is parsing cookies into the response.
 * @returns {Function} A handler for handling any request containing cookies.
 */
function RequestCookieHandler() {
    var funcToReturn =  function (request, response, next) {

        var cookies = request.cookies;
        if (cookies !== undefined) {
            for (var cookieHeader in cookies){
                response.cookie(cookieHeader, cookies[cookieHeader]);
            }
        }
        return next();
    }

    /**
     * Describes the usage of the handler
     * @returns {string}
     */
    funcToReturn.toString = function(){
            return  "This handler enables us to keep the cookies fresh. That is, if a cookie arrives from the server " +
                    "It is automatically copied to the response from the server to the browser.\n" +
                    "It is used to make the login (and staying) easier";
    }

    return funcToReturn;
}

module.exports = RequestCookieHandler;