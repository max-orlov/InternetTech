var Resource = function(method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.regexp = this.createRegex(path);
};


Resource.prototype.handle = function(req, res, next) {
    return this.handler(req, res, next);
};


Resource.prototype.createRegex = function(path) {
    var parts = path.split('/');
    var str= '^';
    for (var i = 0; i < parts.length; i++) {
        if (parts[i]=='') {
            continue;
        }
        str += '\/';
        if (parts[i].match(/:/g)) {
            str += '(?:([^\/]+?))'
        } else {
            str += parts[i];
        }

    }
    str += '\/?';
    return new RegExp(str, 'i');
};


module.exports = Resource;
