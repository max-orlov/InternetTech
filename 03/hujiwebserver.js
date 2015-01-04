var hujiNet         = require("./hujinet"),
    serverSettings  = require("./settings/settings"),
    path            = require('path');

ServerShell = function (serverID, server, port, rootFolder, callbackFunction) {
    this.serverID = serverID;
    this.server = server;
    this.port= port;
    this.rootFolder= rootFolder;
    this.callbackFunc= callbackFunction;
};

var runningServerID = 0;
var serverList = [];

exports.start = function (port, rootFolder, callback) {

    if (isRelative(rootFolder)) {
        var absoluteRootFolder = path.join(__dirname, rootFolder);
    } else {
        absoluteRootFolder = rootFolder;
    }

    var server = hujiNet.getServer(port, serverSettings.hostAddress, absoluteRootFolder, callback);
    serverList.push(new ServerShell(runningServerID, server, port, absoluteRootFolder, callback));
    runningServerID++;
    return serverList[serverList.length - 1].serverID;

};

exports.stop = function (serverID, callback) {
    for (var i = 0 ; i < serverList.length ; i++){
        if (serverList[i].serverID == serverID){
            var tmpServer = serverList[i];
            serverList.splice(i,1);

            try {
                tmpServer.server.close(callback);
            } catch (e) {
                console.log(e);
            }

            break;
        }
    }
};

exports.getServers = function () {
    return serverList;
};

function isRelative(rootDir) {
    var normal = path.normalize(rootDir);
    var absolute = path.resolve(rootDir);
    return normal !== absolute;
}
