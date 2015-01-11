var Hujinet         = require('./hujinet'),
    serverSetting   = require('./../settings/settings'),
    ResourceHandler = require('./../handlers/resourceHandler');

/**
 * The main dynamic server function (class) which manages the different handlers supplied for
 * a specified resource
 * @param hujiEventEmitter a custom emitter to keep track of custom events.
 * @returns {Function}
 * @constructor
 */
var Hujidynamicserver = function (hujiEventEmitter) {
    var handlers = [];

    /**
     * A function which extracts the parameters and places them at the request.params field.
     * @param request the request from the client.
     * @param resource the resource that should be checked along the request.
     */
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

    /**
     * A function which handles the handlers switching, that is - keep the chain of handlers on track,
     * and using any handlers specified for the given resource.
     * @param request the request from the client side.
     * @param response the response to the client side.
     * @param index the index of the current handler.
     */
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
                            response.status(500);
                            return response.send();
                        }
                        app(request, response, index + 1);
                    };
                    response.path = request.path.replace(match[0], '');
                    extractParams(request, handlers[index]);
                    try {
                        handlers[index].handle(request, response, next);
                    } catch (e) {
                        response.status(500);
                        response.send();
                    }
                    return;
                }
            }
        }
        if (index === handlers.length) {
            response.status(404);
            response.send("404 - Page Not Found");
        }
    };


    app.eventEmitter = hujiEventEmitter;
    app.server = new Hujinet(app, hujiEventEmitter);
    app.handlers = handlers;

    /**
     * A function which sets which port should the server to.
     * @param port the port to listen to.
     */
    app.listen = function(port) {
        app.server.listen(port);
    };

    /**
     * Adds a new handler to the specified resource.
     * @param method the method for this handler and resource combination.
     * @param resource the resource for this handler.
     * @param handler the handler itself (for the specified resource).
     */
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
            // TODO : what does this mean? the handler becomes the resource? how should this work?
            handlerFunction = resource;
        }

        var newHandler = new ResourceHandler(method, handlerResource, handlerFunction);
        app.handlers.push(newHandler);
    };

    /**
     * Stops the current server.
     */
    app.stop = function(callback) {
        if (callback != undefined) {
            app.eventEmitter.on(serverSetting.hujiEvent.serverClosed, function () {
                callback();
            });
        }
        app.server.close();
    };

    /**
     * A shell function for the addHandler for the 'use' method.
     * @param resource the resource to be matched with the specified handler.
     * @param handler the handler for the specified resource.
     */
    app.use = function (resource, handler) {
        app.addHandler('use', resource, handler);
    };
    /**
     * A shell function for the addHandler for the 'GET' method.
     * @param resource the resource to be matched with the specified handler.
     * @param handler the handler for the specified resource.
     */
    app.get = function (resource, handler) {
        app.addHandler('GET', resource, handler);
    };
    /**
     * A shell function for the addHandler for the 'POST' method.
     * @param resource the resource to be matched with the specified handler.
     * @param handler the handler for the specified resource.
     */
    app.post = function (resource, handler) {
        app.addHandler('POST', resource, handler);
    };
    /**
     * A shell function for the addHandler for the 'PUT' method.
     * @param resource the resource to be matched with the specified handler.
     * @param handler the handler for the specified resource.
     */
    app.put = function (resource, handler) {
        app.addHandler('PUT', resource, handler);
    };
    /**
     * A shell function for the addHandler for the 'DELETE' method.
     * @param resource the resource to be matched with the specified handler.
     * @param handler the handler for the specified resource.
     */
    app.delete = function (resource, handler) {
        app.addHandler('DELETE', resource, handler);
    };

    return app;
};

module.exports = Hujidynamicserver;