var net         = require("net");
    fs          = require("fs");
    path        = require("path");
    url         = require("url");
    querystring = require("querystring");


var CRLF = '\r\n';
var STATUS_CODES = {
    200 : 'OK',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    500 : 'Parsing Error'
};

var SERVER_VERSION = "v0.10.33";

Server = function () {
    this.root = "";
    this.headers = "";
};

exports.start = function (port, rootFolder, callback) {
    console.log("1111");
};

exports.stop = function (serverID, callback) {
    console.log("1111");
};

