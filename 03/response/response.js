var serverSettings  = require('./../settings/settings');

var Response = function (httpVersion, statusCode) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = new(Date)().toUTCString();
    this.headers['server'] = serverSettings.serverVersion;
    this.streamPipe = null;

};


module.exports = Response;


