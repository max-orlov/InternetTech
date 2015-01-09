var ResourceHandler = function (method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.regexp = this.regex(path);
};


ResourceHandler.prototype.handle = function(req, res, next) {
    return this.handler(req, res, next);
};


ResourceHandler.prototype.regex = function (path) {
    //TODO:: There is a bug here. for example: resource = "/root", request.path = "rooter.html", and the regex matches!
    var parts = path.split('/');
    var str= '^';
    for (var i = 0; i < parts.length; i++) {
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
    str += '\/?';
    return new RegExp(str, 'i');
};


module.exports = ResourceHandler;
