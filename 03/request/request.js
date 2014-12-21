var serverSettings  = require('./../settings/settings');

var Request = function(){
    this.method = null;
    this.path = null;
    this.params = {};
    this.status = null;
    this.httpVersion = null;
    this.headers = {};
    this.body = null;
};

Request.prototype.isKeepAlive = function() {
    if (this.httpVersion === serverSettings.HTTP_SUPPORTED_VERSIONS['1.0']) {
        return this.headers["connection"] && this.headers["connection"].toLowerCase() === "keep-alive";
    } else {
        return !(this.headers["connection"] && this.headers["connection"].toLowerCase() === "close");
    }
};

module.exports = Request;
