var serverSettings  = require('./../settings/settings');

var Request = function(){
    this.method = null;
    this.path = null;
    this.params = {};
    this.status = this.requestStatus.initialized;
    this.statusCode = null;
    this.httpVersion = null;
    this.headers = {};
    this.body = "";
    this.rawData = "";
    this.messageError = "";
    this.parseIndex = 0;
};

Request.prototype.isKeepAlive = function () {
    if (this.httpVersion === serverSettings.httpSupportedVersions['1.0']) {
        return this.headers["connection"] &&
                this.headers["connection"].toLowerCase() === "keep-alive";
    } else {
        return !(this.headers["connection"] &&
                this.headers["connection"].toLowerCase() === "close");
    }
};

Request.prototype.requestStatus = {
    errorParsing    : "error parsing",
    initialized     : "initialized",
    separateMethod  : 'separatedMethod',
    parseMethod     : 'parseMethod',
    validateMethod  : 'validateMethod',
    separatedHeaders: "separatedHeaders",
    parsedHeaders   : "parsedHeaders",
    validatedHeaders: "validatedHeaders",
    done            : "done"
};

module.exports = Request;
