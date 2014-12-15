var hujiNet         = require("./hujinet");
    fs          = require("fs");
    path        = require("path");
    url         = require("url");
    querystring = require("querystring");
    hujiParser      = require("./hujiparser")
var lPort, root, server;

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
    root = rootFolder;
    lPort = port;
    server = hujiNet.getSocket(lPort, "localhost");
    console.log(hujiNet.getRequestContent());
    console.log("REFRESh NOW!")
    setTimeout(function () {
        console.log(hujiNet.getRequestContent());
    },3000);
};

exports.stop = function (serverID, callback) {
    console.log("1111");
};

