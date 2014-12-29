var hujiNet         = require("./hujinet"),
    serverSettings  = require("./settings/settings"),
    debug           = require('./debugging/debug');


var runningServerID = 0;

Server = function(serverID, server, port, rootFolder, callbackFunction){
    this.serverID = serverID;
    this.server = server;
    this.port= port;
    this.rootFolder= rootFolder;
    this.callbackFunc= callbackFunction;
};

var serverList = [];

exports.start = function (port, rootFolder, callback) {
    var server = hujiNet.getSocket(port, serverSettings.hostAddress, rootFolder, callback, runningServerID);
    serverList.push(new Server(runningServerID, server, port, rootFolder, callback));
    runningServerID++;
    return serverList[serverList.length - 1].serverID;

};

exports.stop = function (serverID, callback) {
    console.log("Stopping server");
    for (var i = 0 ; i < serverList.length ; i++){
        if (serverList[i].serverID === serverID){
            var tmpServer = serverList[i];
            serverList.splice(i,1);
            tmpServer.server.close(callback);
            break;
        }
    }
};

exports.getServers = function () {
    return serverList;
};