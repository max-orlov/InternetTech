
function requestCookieHandler() {
    return function (request, response, next) {
        var cookie = request.get('cookie');
        if (cookie !== undefined) {
            var cookieCouples = cookie.split(/;/g);
            for (var i = 0; i < cookieCouples; i++) {
                var couple = cookieCouples[i].split(/=/g);
                if (couple.length !== 2) {
                    throw new Error("Cookie format is invalid");
                }
                var key = couple[0].trim();
                var value = couple[1].trim();
                request.cookies[key] = value;
            }
        }
        return next();
    }
}

module.exports = requestCookieHandler();