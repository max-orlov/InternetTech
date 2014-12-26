var serverSettings  = require('./../settings/settings');

var Response = function (httpVersion, statusCode, date) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = date;
    this.headers['server'] = serverSettings.serverVersion;
};

module.exports = Response;
