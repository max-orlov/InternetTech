var fs              = require('fs'),
    path            = require('path'),
    mimeTypes       = require('./../settings/mimeTypes');

/**
 * A static request handler, this build in handler provides a static webserver handler
 * @param rootFolder the root folder for the static web server.
 * @returns {Function} a handler to handle any static based request (that is if a source is supplied previously).
 * @constructor
 */
function StaticRequestHandler(rootFolder) {
    return function (request, response, next) {
        if (request.path.indexOf("..") !== -1) {
            return next();
        }

        var normPath =  __dirname + '\\..' + path.join(rootFolder, response.path);
        var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);
        fs.readFile(normPath, function(err, fileContent) {
            // no err was returned - so the file exists.
            if (err === null) {
                response.set('content-type', mimeTypes.getMimeType(fileType));
                response.send(fileContent);
            }
            else
                return next();
        });
    }
}

module.exports = StaticRequestHandler;
