
function requestCookieHandler() {
    return function (request, response, next) {
        var cookie = request.get('cookie');
        if (cookie !== undefined) {
            var cookieCouples = cookie.split(/;/g);
            for (var i = 0; i < cookieCouples.length; i++) {
                var couple = cookieCouples[i].split(/=/g);
                if (couple.length !== 2) {
                    throw new Error("Cookie format is invalid");
                }
                request.cookies[couple[0].trim()] = couple[1].trim();
            }
        }
        return next();
    }
}

module.exports = requestCookieHandler;