var serverSettings  = require('./../settings/settings');

var Request = function() {
    this.params = {};
    this.headers = {};
    this.query = "";
    this.method = "";
    this.cookies = "";
    this.path = "";
    this.host = "";
    this.protocol = "";
    this.body = null;

    this.status = this.requestStatus.initialized;
    this.httpVersion = null;
    this.rawData = ""
    this.parseIndex = null;

};


/**
 * Get the case-insensitive request header field. The Referrer and Referer fields are interchangeable.
 * @param field
 */
Request.prototype.get = function(field){
    return this[field];
}

Request.prototype.param = function(name, defaultValue){
    if (this.params[name] === undefined)
        return defaultValue;
    else
        return this.params[name];
}

/**
 * Check if the incoming request contains the "Content-Type" header field, and if it matches the give mime type.
 * @param type
 */
Request.prototype.is = function(type){
    return this.headers[type] != undefined && this.headers[type].indexOf(type) != -1;
}

/**
 * Checks if the request is of keep-alive type.
 * @returns {*}
 */
Request.prototype.isKeepAlive = function() {
    //return false;
    if (this.httpVersion === serverSettings.httpSupportedVersions['1.0']) {
        return this.headers["connection"] && this.headers["connection"].toLowerCase() === "keep-alive";
    } else {
        return !(this.headers["connection"] && this.headers["connection"].toLowerCase() === "close");
    }
};


Request.prototype.requestStatus = {
    initialized : "initialized",
    separateMethod: 'seperatedMethod',
    parseMethod: 'parseMethod',
    validateMethod: 'validateMethod',
    separatedHeaders: "separatedHeaders",
    parsedHeaders : "parsedHeaders",
    validatedHeaders: "validatedHeaders",
    done : "done"
};

module.exports = Request;
