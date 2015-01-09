/**
 * A constructor for the resouce handler.
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
    var parts = path.split('/');
    var str= '^';
    for (var i = 0; i < parts.length ; i++) {
        if (parts[i] === '') {
            continue;
        }
        str += '\/';
        if (parts[i].match(/:/g)) {
            str += '(?:([^\/]+?))';
        } else {
            str += parts[i];
        }
    }

    str += '\/' ;

    return new RegExp(str, 'i');
};


module.exports = ResourceHandler;
