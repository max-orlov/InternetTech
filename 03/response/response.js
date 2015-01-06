var serverSettings  = require('./../settings/settings'),
    parser          = require('./../parser/hujiparser');

var Response = function (httpVersion, statusCode, isKeepAlive, socket) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = new(Date)().toUTCString();
    this.headers['server'] = serverSettings.serverVersion;

    this.isKeepAlive = isKeepAlive;
    this.socket = socket;

};

/**
 * Set header field to value, or pass an object to set multiple fields at once.
 * @param field
 * @param value
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
 * Get the case-insensitive response header field.
 * @param field
 */
Response.prototype.get = function (field) {
    if (field) {
        field = field.toLowerCase();
        if (field in this.headers) {
            return this.headers[field];
        }
    }
    return undefined;
};

/**
 * Set cookie name to value, which may be a string or object converted to JSON.
 *
 * @param name
 * @param value
 * @param options
 */
Response.prototype.cookie = function (name, value, options) {
    if (name !== undefined && name !== null) {
        if (options === undefined) {
            options = {}
        }
        if (!('path' in options)) {
            options['path'] = '/';
        }
        if ('maxAge' in options){
            var maxAge = options['maxAge'];
            options['expires'] = new Date(Date.now() + parseInt(maxAge)).toUTCString();
            delete options['maxAge'];
        }
        if (!(('expires') in options)) {
            options['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        var cookie = name.toString().trim() + '=' + value;
        var flags = '';
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var val = options[key].toString().trim();
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

Response.prototype.writeHeaders = function () {
    var responseStr = parser.stringify(this);
    this.socket.write(responseStr);
};

/**
 * This method performs a myriad of useful tasks for simple non-streaming responses such as automatically assigning
 * the Content-Length unless previously defined and providing automatic HEAD and HTTP cache freshness support.
 */
Response.prototype.send = function (body) {
    if (typeof body === 'undefined') {
        if (this.get('content-type') === undefined) {
            this.set('content-type', serverSettings.contentsTypes['txt']);
        }
        body = '';
    } else if (typeof body === 'string'){
        if (this.get('content-type') === undefined) {
            this.set('content-type', serverSettings.contentsTypes['txt']);
        }
    } else if (typeof body === 'object'){
        if (body === null) {
            if (this.get('content-type') === undefined) {
                this.set('content-type', serverSettings.contentsTypes['txt']);
            }
            if (this.get('content-length') === undefined) {
                this.set('content-length', 0);
            }
        } else if (Buffer.isBuffer(body)) {
            if (this.get('content-type') === undefined) {
                this.set('content-type', serverSettings.contentsTypes['buffer']);
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
 * Send a JSON response. This method is identical to res.send() when an object or array is passed. However, it
 * may be used for explicit JSON conversion of non-objects, such as null, undefined, etc. (although these are
 * technically not valid JSON).
 * @param body
 */
Response.prototype.json = function (body) {
    this.set('content-type', serverSettings.contentsTypes('json'));
    this.send(JSON.stringify(body));
};

/**
 * Chainable alias of node's res.statusCode. Use this method to set the HTTP status for the response.
 * @param status
 */
Response.prototype.status = function (status) {
    this.statusCode = status;
    return this;
};

Response.prototype.write = function (data, encoding) {
    this.writeHeaders();

    if (this.method !== serverSettings.httpMethods['HEAD']) {

        if (data !== undefined && data != null) {
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


