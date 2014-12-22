var serverSettings  = require('./../settings/settings');

var Request = function(){
    this.method = null;
    this.path = null;
    this.params = {};
    this.status = this.requestStatus.initialized;
    this.httpVersion = null;
    this.headers = {};
    this.body = null;
    this.rawData = ""
    this.parseIndex = null;
};

Request.prototype.isKeepAlive = function() {
    if (this.httpVersion === serverSettings.HTTP_SUPPORTED_VERSIONS['1.0']) {
        return this.headers["connection"] && this.headers["connection"].toLowerCase() === "keep-alive";
    } else {
        return !(this.headers["connection"] && this.headers["connection"].toLowerCase() === "close");
    }
};

Request.prototype.requestStatus = {
    initialized : "initialized",
    separatedHeaders: "separatedHeaders",
    parsedHeaders : "parsedHeaders",
    validatedHeaders: "validatedHeaders",
    done : "done"
};

module.exports = Request;
