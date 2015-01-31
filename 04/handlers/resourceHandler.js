/**
 * A constructor for the resource handler.
 * @param method the method of access to the resource
 * @param path the resource itself
 * @param handler the handler to be called on the specified resource.
 * @constructor
 */
var ResourceHandler = function (method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.regexp = this.regex(path);
};

/**
 * Utilizes the handler supplied previously in the constructor on the supplied arguments.
 * @param req the request object for the handler.
 * @param res the response object for the handler.
 * @param next the next handler to be called.
 * @returns {*}
 */
ResourceHandler.prototype.handle = function(req, res, next) {
    return this.handler(req, res, next);
};

/**
 * Generates a regex representation of the given resource
 * @param path the resource to be regexed.
 * @returns {RegExp} the regex representation of the resource.
 */
ResourceHandler.prototype.regex = function (path) {
    var pathParts = path.split('/');
    var regexStr = '^';
    for (var i = 0; i < pathParts.length; i++) {
        if (pathParts[i] !== '') {
            regexStr += '\/';
            if (pathParts[i].match(/:/g)) {
                regexStr += '(?:([^\/]+?))';
            } else {
                regexStr += pathParts[i];
            }
        }
    }
    regexStr += '($|\/)';
    return new RegExp(regexStr, 'i');
};


module.exports = ResourceHandler;

