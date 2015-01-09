var fs              = require('fs'),
    path            = require('path'),
    serverSettings  = require('./../settings/settings'),
    mimeTypes       = require('./../settings/mimeTypes');

function StaticRequestHandler(rootFolder) {
    return function (request, response, next) {
        if (request.path.indexOf("..") != -1) {
            return next();
        }

        var normPath =  __dirname + '\\..' + path.join(rootFolder, response.path);
        console.log(normPath);
        var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);
        fs.readFile(normPath, function(err, fileContent) {
            // no err was returned - so the file exists.
            if (err == null) {
                response.set('content-type', mimeTypes.getMimeType(fileType));
                response.send(fileContent);
            }

            // No file was found
            else if (err.code == 'ENOENT') {
                var pageNotFoundPath = path.normalize(__dirname + '/../' + serverSettings.pageNotFoundPath);
                fs.readFile(pageNotFoundPath, function(err, pageNotFountFileContent) {
                    if (err == null) {
                        response.statusCode = 404;
                        response.set('content-type', mimeTypes.getMimeType('html'));

                        response.send(pageNotFountFileContent);
                    }
                });
            }
        });
    }
}

module.exports = StaticRequestHandler;
