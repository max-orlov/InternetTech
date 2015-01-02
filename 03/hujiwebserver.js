var hujiNet         = require("./hujinet"),
    serverSettings  = require("./settings/settings"),
    path = require('path');


//TODO : Kinda works, need to decide what to do with a server that doesn't exist (upon closure).
//TODO : Check if the abs/rel path is working - check for upper level pathing.


ServerShell = function(serverID, server, port, rootFolder, callbackFunction){
    this.serverID = serverID;
    this.server = server;
    this.port= port;
    this.rootFolder= rootFolder;
    this.callbackFunc= callbackFunction;
};

var serverList = [];

exports.start = function (port, rootFolder, callback) {
    var isServerExists = false

    for (var serverIndex in serverList){
        if (serverList[serverIndex].port === port){
            isServerExists = true
        }
    }
    if (isServerExists === false) {
        if (isRelative(rootFolder)) {
            var absoluteRootFolder = path.join(__dirname, rootFolder);
        } else {
            absoluteRootFolder = rootFolder;
        }

        var server = hujiNet.getServer(port, serverSettings.hostAddress, absoluteRootFolder, callback);
        serverList.push(new ServerShell(serverList.length, server, port, absoluteRootFolder, callback));
        return serverList[serverList.length - 1].serverID;
    }
    else{
        console.log("server is already up and listening on that port")
        return null;
    }

};

exports.stop = function (serverID, callback) {
    for (var i = 0 ; i < serverList.length ; i++){
        if (serverList[i].serverID == serverID){
            var tmpServer = serverList[i];
            serverList.splice(i,1);
            tmpServer.server.close(callback);
            break;
        }
    }
    console.log("No server with the specified port is running")
};

exports.getServers = function () {
    return serverList;
};

function isRelative(rootDir) {
    var normal = path.normalize(rootDir);
    var absolute = path.resolve(rootDir);
    return normal !== absolute;
}
