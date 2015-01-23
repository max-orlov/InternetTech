var serverSettings  = require('./../settings/settings'),
    generalFuncs    = require('./../settings/generalFuncs'),
    mimeTypes       = require('./../settings/mimeTypes');

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
    this.parseIndex = 0;

};


/**
 * Gets the case-insensitive request header field. The Referrer and Referrer fields are interchangeable.
 * @param field the requested header field.
 * @returns {*} the requested header field value if exists, otherwise returns undefined.
 */
Request.prototype.get = function (field) {
    if (field) {
        field = field.toLowerCase();
        if (field in generalFuncs.objKeysToLowerCase(this.headers)) {
            return generalFuncs.objKeysToLowerCase(this.headers)[field];
        }
    }
    return undefined;
};

/**
 * Returns the value of param name when present.
 * @param name param name.
 * @param defaultValue one can specify defaultValue to set a default value if the
 *        parameter is not found in any of the request objects.
 * @returns {*} the value of param name when present, otherwise return defaultValue if defined, otherwise return undefined.
 */
Request.prototype.param = function (name, defaultValue) {
    if(name) {

        var params = generalFuncs.objKeysToLowerCase(this.params);
        var query = generalFuncs.objKeysToLowerCase(this.query);

        name = name.toLowerCase();
        if (params && name in params){
            return params[name];
        } else if (query &&name in query) {
            return query[name];
        }
    }
    return defaultValue;
};

/**
 * Check if the incoming request contains the "Content-Type" header field, and if it matches the give mime type.
 * @param type the given mime type.
 * @returns {boolean} true if the given mime type matches the request content-type, otherwise false.
 */
Request.prototype.is = function (type) {
    var requestType = this.get('content-type');
    //checks that the request contains the content-type header field.
    if (!type || !requestType) {
        return false;
    }
    requestType = requestType.split(/;/g)[0].trim().toLowerCase();
    type = type.trim().toLowerCase();

    //checks whether we support the request content-type.
    if (!mimeTypes.hasMimeType(requestType)) {
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
 * @returns {*} true if the request is of keep-alive type, otherwise returns false.
 */
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
    separateMethod  : "separatedMethod",
    parseMethod     : "parseMethod",
    validateMethod  : "validateMethod",
    separatedHeaders: "separatedHeaders",
    parsedHeaders   : "parsedHeaders",
    validatedHeaders: "validatedHeaders",
    done            : "done"
};

module.exports = Request;
