var Hujidynamicserver       = require("./server/hujidynamicserver"),
    serverSettings          = require("./settings/settings"),
    path                    = require('path'),
    StaticRequestHandler    = require('./handlers/staticRequestHandler');



exports.start = function(port, callback) {
    var server = new Hujidynamicserver();
    try {
        server.listen(port);
    } catch (e) {
        callback(e, server)
    }
    callback(undefined, server);
};



exports.static = function(rootFolderPath) {
    return StaticRequestHandler(rootFolderPath);
};
