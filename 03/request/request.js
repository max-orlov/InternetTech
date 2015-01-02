var serverSettings  = require('./../settings/settings');

var Request = function() {
    this.headers = {};
    this.params = {};
    this.query = {};
    this.httpVersion = null;
    this.method = null;
    this.path = null;
    this.host = null;
    this.cookies = {};
    this.protocol = "http";
    this.body = undefined;

    this.status = this.requestStatus.initialized;

    this.rawData = "";
    this.rawHeaders = "";
    this.rawBody = "";
    this.parseIndex = 0;

};


/**
 * Get the case-insensitive request header field. The Referrer and Referrer fields are interchangeable.
 * @param field
 */
Request.prototype.get = function (field) {
    if (field) {
        field = field.toLowerCase();
        if (field in this.headers) {
            return this.headers[field];
        }
    }
    return undefined;
};

/**
 * Return the value of param name when present.
 * @param name
 * @param defaultValue
 * @returns {*}
 */
Request.prototype.param = function(name, defaultValue){
    if(name) {
        if (name in this.params) {
            return this.params[name]
        } else if (name in this.body) {
            return this.body[name];
        } else if (name in this.query) {
            return this.query[name];
        }
    }
    return defaultValue;
};

/**
 * Check if the incoming request contains the "Content-Type" header field, and if it matches the give mime type.
 * @param type
 */
Request.prototype.is = function(type){
    var requestType = this.get('context-type');
    if (!type || !requestType) {
        return false;
    }
    requestType = requestType.split(/;/g)[0].trim();
    type = type.trim();

    if (!serverSettings.hasContentType(requestType)) {
        return false;
    }

    if (requestType === type) {
        return true;
    }
    requestType = requestType.split(/\//g);
    type = type.split(/\//g);

    return ((requestType[1] === type[0]) || (requestType[0] === type[0] && type[1] === '*'));
};

/**
 * Checks if the request is of keep-alive type.
 * @returns {*}
 */
Request.prototype.isKeepAlive = function() {
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
    separateMethod  : "separatedMethod",
    parseMethod     : "parseMethod",
    validateMethod  : "validateMethod",
    separatedHeaders: "separatedHeaders",
    parsedHeaders   : "parsedHeaders",
    validatedHeaders: "validatedHeaders",
    done            : "done"
};

module.exports = Request;
