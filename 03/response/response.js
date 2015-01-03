var serverSettings  = require('./../settings/settings');

var Response = function (httpVersion, statusCode, socket) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = new(Date)().toUTCString();
    this.headers['server'] = serverSettings.serverVersion;

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
                    Response.headers[key] = field[key];
                }
            }
        }
    } else {
        Response.headers[field] = value;
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
Response.prototype.cookie = function(name, value, options){

};

/**
 * This method performs a myriad of useful tasks for simple non-streaming responses such as automatically assigning
 * the Content-Length unless previously defined and providing automatic HEAD and HTTP cache freshness support.
 */
Response.prototype.send = function(body){
    if (typeof body === 'undefined') {
        this.set('content-type', serverSettings.contentsTypes['txt']);
    } else if (typeof body === 'string'){
        this.set('content-type', serverSettings.contentsTypes['txt']);
    } else if (typeof body === 'object'){
        if (body === null) {
            this.set('content-type', serverSettings.contentsTypes['txt']);
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

};

/**
 * Send a JSON response. This method is identical to res.send() when an object or array is passed. However, it
 * may be used for explicit JSON conversion of non-objects, such as null, undefined, etc. (although these are
 * technically not valid JSON).
 * @param body
 */
Response.prototype.json = function(body){
    //TODO: stringify for JSON is not fully clear to me. for example, what should happen for body = null or undefined?
    this.send(JSON.stringify(body, null,'\t'));

};

/**
 * Chainable alias of node's res.statusCode. Use this method to set the HTTP status for the response.
 * @param status
 */
Response.prototype.status = function(status){
    this.statusCode = status;
    return this;
};

module.exports = Response;


