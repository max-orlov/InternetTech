var serverSettings  = require('./../settings/settings'),
    Hujinet  = require('./hujinet.js'),
    Request = require('./../request/request'),
    Response = require('./../response/response'),
    ResourceHandler = require('./../handlers/resourceHandler');

var Hujidynamicserver = function () {
    var handlers = [];
    
    var extractParams = function(request, resource) {
        var params = {};
        var requestParts = request.path.split('/');
        var resourceParts = resource.path.split('/');

        for (var i = 0; i < resourceParts.length; i++) {
            if (resourceParts[i].match(/:/g)) {
                params[resourceParts[i].replace(':','')] = requestParts[i];
            }
        }
        request.params = params;
    };

    var app = function(request, response, index) {
        if (index === undefined) {
            index = 0;
        }

        for (; index < app.handlers.length; index++) {
            var handler = app.handlers[index];
            if (handler.method === 'use' || handler.method.toLowerCase() === request.method.toLowerCase()) {
                var match = request.path.match(app.handlers[index].regexp);
                if (match) {
                    var next = function (err) {
                        if (err) {
                            response.statusCode = 500;
                            return response.send();
                        }
                        app(request, response, index + 1);
                    };
                    response.path = request.path.replace(match[0], '');
                    extractParams(request, handlers[index]);
                    try {
                        handlers[index].handle(request, response, next);
                    } catch (e) {
                        response.statusCode = 500;
                        response.send();
                    }
                    return;
                }
            }
        }
        if (index === handlers.length) {
            response.statusCode = 404;
            response.send("404 - Page Not Found");
        }
    };

    app.handlers = handlers;
    app.server = new Hujinet(app);

    app.listen = function(port) {
        try {
            this.server.listen(port);
        }
        catch (e){
            throw new Error(e.message);
        }
    };

    app.addHandler = function(method, resource, handler) {
        if ((method === undefined) && (resource === undefined) && (handler === undefined)) {
            return;
        }
        var handlerFunction = null;
        var handlerResource = null;

        if (handler !== undefined) {
            if (resource === '') {
                handlerResource = '/';
            } else {
                handlerResource = resource;
            }
            handlerFunction = handler;
        } else {
            handlerResource = '/';
            handlerFunction = resource;
        }

        var newHandler = new ResourceHandler(method, handlerResource, handlerFunction);
        this.handlers.push(newHandler);
    };

    app.stop = function(){
        this.server.close();
    };


    //app.use = function (resouce, handler) {
    //    this.addHandler('use', resouce, handler);
    //};
    app.use = app.addHandler.bind(app, "use");
    app.get = app.addHandler.bind(app, "GET");
    app.post = app.addHandler.bind(app, "POST");
    app.put = app.addHandler.bind(app, "PUT");
    app.delete = app.addHandler.bind(app, "DELETE");

    return app;

};

module.exports = Hujidynamicserver;