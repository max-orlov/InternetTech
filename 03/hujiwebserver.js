var hujiNet         = require("./hujinet");
    fs          = require("fs");
    path        = require("path");
    url         = require("url");
    querystring = require("querystring");
    hujiParser      = require("./hujiparser")
var lPort, server;

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
    this.server = "";
};

exports.start = function (port, rootFolder, callback) {
    lPort = port;
    server = hujiNet.getSocket(lPort, "localhost", rootFolder);
    console.log("Server is up and listening");

};

exports.stop = function (serverID, callback) {
    console.log("Stoppin server");
};

