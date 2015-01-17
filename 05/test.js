var http            = require('http'),
    net             = require('net'),
    serverSetting   = require('./settings/settings'),
    hujiwebserver   = require('./hujiwebserver');

var lport           = 8888;

/**
 * Generates the options for an http request
 * @param host the host of the request
 * @param port the port of the request
 * @param path the path required
 * @param method the method of the request
 * @param connection the connection of the request
 * @returns {{host: *, port: *, path: *, method: *, headers: {Connection: *}}}
 */
function generateOptions(host, port, path, method, connection) {
    return {
        host: host,
        port: port,
        path: path,
        method: method,
        headers : {Connection: connection}
    }
}
