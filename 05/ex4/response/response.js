var serverSettings  = require('./../settings/settings'),
    parser          = require('./../parser/hujiparser'),
    generalFuncs    = require('./../settings/generalFuncs'),
    mimeTypes       = require('./../settings/mimeTypes');

var Response = function (httpVersion, statusCode, isKeepAlive, method, socket) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.statusText = null;
    this.headers = {};
    this.headers['date'] = new(Date)().toUTCString();
    this.headers['server'] = serverSettings.serverVersion;

    this.method = method;
    this.isKeepAlive = isKeepAlive;
    this.socket = socket;

};

/**
 * Sets header field to value, or pass an object to set multiple fields at once.
 * @param field header field to set.
 * @param value value of the header field
 */
Response.prototype.set = function (field, value) {
    if (value === undefined) {
        if (typeof field === 'object') {
            for (var key in field) {
                if (field.hasOwnProperty(key)) {
                    this.headers[key] = field[key];
                }
            }
        }
    } else {
        this.headers[field] = value;
    }
};

/**
 * Gets the case-insensitive response header field.
 * @param field the requested header field.
 * @returns {*} the requested header field value if exists, otherwise returns undefined.
 */
Response.prototype.get = function (field) {
    if (field) {
        field = field.toLowerCase();
        if (field in generalFuncs.objKeysToLowerCase(this.headers)) {
            return generalFuncs.objKeysToLowerCase(this.headers)[field];
        }
    }
    return undefined;
};

/**
 * Set cookie name to value, which may be a string or object converted to JSON.
 *
 * @param name name of the cookie.
 * @param value value of the cookie.
 * @param options object of optional options to set.
 */
Response.prototype.cookie = function (name, value, options) {
    //checks that the cookie name is defined.
    if (name !== undefined && name !== null) {
        if (options === undefined) {
            options = {}
        }
        //converts all the options keys to lowercase.
        var optionsToLower = generalFuncs.objKeysToLowerCase(options);

        //if the path isn't set, set's it to '/'.
        if (!('path' in optionsToLower)) {
            optionsToLower['path'] = '/';
        }
        //updates the expires property by according to the maxAge property (if exists).
        if ('maxage' in optionsToLower){
            var maxAge = optionsToLower['maxage'];
            optionsToLower['expires'] = new Date(Date.now() + parseInt(maxAge)).toUTCString();
            delete optionsToLower['maxAge'];
        }
        //if expires property isn't set, sets it to the first date.
        if (!(('expires') in optionsToLower)) {
            optionsToLower['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        var cookie = name.toString().trim() + '=' + value;
        var flags = '';
        //iterates over all the options.
        for (var key in optionsToLower) {
            if (optionsToLower.hasOwnProperty(key)) {
                //skip the options flags, and attach them at the end.
                var val = optionsToLower[key].toString().trim();
                if (val === 'false') {
                    continue;
                }
                if (val === 'true') {
                    flags += '; ' + key;
                }
                else {
                    cookie += '; ' + key.toString().trim() + '=' + val;
                }

            }
        }
        cookie += flags;
        var currentCookie = this.get('set-cookie');
        var cookies = currentCookie !== undefined ? currentCookie : [];
        cookies.push(cookie);
        this.set('set-cookie', cookies);

    }
};

/**
 * Writes the response headers to the socket.
 */
Response.prototype.writeHeaders = function () {
    var responseStr = parser.stringify(this);
    this.socket.write(responseStr);
};

/**
 * Send a response.
 * This method performs a myriad of useful tasks for simple non-streaming responses such as automatically assigning
 * the Content-Length unless previously defined and providing automatic HEAD and HTTP cache freshness support.
 * @param body the response body.
 * @returns {*} in case the given body is an object, return this.json.
 */
Response.prototype.send = function (body) {
    //before each set, checks that the content-type/content-length isn't already set.
    if (typeof body === 'undefined') {
        if (this.get('content-type') === undefined) {
            this.set('content-type', mimeTypes.getMimeType('txt'));
        }
        body = '';
    } else if (typeof body === 'string'){
        if (this.get('content-type') === undefined) {
            this.set('content-type', mimeTypes.getMimeType('txt'));
        }
    } else if (typeof body === 'object'){
        if (body === null) {
            if (this.get('content-type') === undefined) {
                this.set('content-type', mimeTypes.getMimeType('txt'));
            }
            if (this.get('content-length') === undefined) {
                this.set('content-length', 0);
            }
        } else if (Buffer.isBuffer(body)) {
            if (this.get('content-type') === undefined) {
                this.set('content-type', mimeTypes.getMimeType('buffer'));
            }
        } else {
            return this.json(body);
        }
    }
    if (this.get('content-length') === undefined) {
        this.set('content-length', body.length);
    }
    return this.write(body);
};

/**
 * Sends a JSON response. This method is identical to res.send() when an object or array is passed.
 * However, it may be used for explicit JSON conversion of non-objects, such as null, undefined, etc.
 * (although these are technically not valid JSON).
 * @param body the response body.
 */
Response.prototype.json = function (body) {
    this.set('content-type', mimeTypes.getMimeType('json'));
    this.send(JSON.stringify(body));
};

/**
 * Chainable alias of node's res.statusCode. Use this method to set the HTTP status for the response.
 * @param status the status to set out response to.
 * @returns {Response} this response object.
 */
Response.prototype.status = function (status) {
    this.statusCode = status;
    return this;
};

/**
 * Writes the a given data to the socket (in case the wanted method is not HEAD method).
 * Writes the header before.
 * @param data the data to be sent.
 * @param encoding the encoding of the data (default to utf-8).
 */
Response.prototype.write = function (data, encoding) {
    this.writeHeaders();

    if (this.method !== serverSettings.httpMethods['HEAD']) {

        if (data !== undefined && data !== null) {
            if (encoding !== undefined) {
                this.socket.write(data, encoding);
            } else {
                this.socket.write(data);
            }
        }
    }
    if (!this.isKeepAlive) {
        this.socket.end();
    }
};

module.exports = Response;


