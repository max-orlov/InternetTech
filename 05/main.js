var hujiwebserver   = require('./hujiwebserver'),
    Value            = require('./Value'),
    Users           = require('./users');


hujiwebserver.start(8888, function (e, server) {
    if (e) {
        console.log(e);
    } else {
        var value = new Value();
        var users = new Users();
        server.use('/app', hujiwebserver.static('/www/'));

        server.get('/aloha', function(request, response){
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            response.status(200);
            if (user){
                response.json({list: value.list(user.id), listSize: value.todos.size()});
            }
            else{
                response.send();
            }
        });

        server.get('/mahalo', function(request, response) {
            if (request.cookies && request.cookies['sessionId']) {
                var sessionId = users.getUserBySessionId(request.cookies['sessionId']).session.sessionId;
                if (sessionId) {
                    users.getUserBySessionId(request.cookies['sessionId']).session.expirationDate = Date.now() - 1;
                    response.cookie('sessionId', sessionId, {expires: 0});
                    response.status(200).send();
                }
            }
        });

        server.get('/env', function(request, response){
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            if (user) {
                response.json({tasksRemain: value.tasksRemain, totalListSize: value.todos.size()})
            }
            else{
                var stat = {status: 1, msg: "User is not logged in"};
                response.statusText = stat.msg;
                response.status(400).json(stat);
            }

        });

        server.get('/item', function (request, response) {
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            if (user) {
                response.json(value.list(user.id));
            } else {
                var stat = {status: 1, msg: "User is not logged in"};
                response.statusText = stat.msg;
                response.status(400).json(stat);
            }
        });

        server.post('/item', function (request, response) {
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            if (user) {
                request.body.owner = user.id;
                var stat = value.create(request.body);
                var responseStatus = stat.status === 0 ? 200 : 500;
                if (responseStatus === 500) {
                    response.statusText = stat.msg;
                }
                response.status(responseStatus).json(stat);
            } else {
                stat = {status: 1, msg: "User is not logged in"};
                response.statusText = stat.msg;
                response.status(400).json(stat);
            }
        });

        server.put('/item', function (request, response) {
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            if (user) {
                var stat = value.update(request.body, user.id);
                var responseStatus = stat.status === 0 ? 200 : 500;
                if (responseStatus === 500) {
                    response.statusText = stat.msg;
                }
                response.status(responseStatus).json(stat);
            } else {
                stat = {status: 1, msg: "User is not logged in"};
                response.statusText = stat.msg;
                response.status(400).json(stat);
            }

        });

        server.delete('/item', function (request, response) {
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            if (user) {
                request.body.owner = user.id;
                var stat = value.delete(request.body.id , user.id);
                var responseStatus = stat.status === 0 ? 200 : 500;
                if (responseStatus === 500) {
                    response.statusText = stat.msg;
                }
                response.status(responseStatus).json(stat);
            } else {
                stat = {status: 1, msg: "User is not logged in"};
                response.statusText = stat.msg;
                response.status(400).json(stat);
            }
        });

        server.post('/register', function (request, response) {
            var stat = users.register(request.body);
            var responseStatus = stat.status === 0 ? 200 : 500;
            if (responseStatus === 200) {
                var sessionId = users.getUserByUsername(request.body.username).session.sessionId;
                response.cookie('sessionId', sessionId, {expires : Date.now() + (60 * 60 * 24 * 30)});
            } else if (responseStatus === 500) {
                response.statusText = stat.msg;
            }
            response.status(responseStatus).json(stat);
        });

        server.post('/login', function (request, response) {
            var stat = users.login(request.body);
            var responseStatus = stat.status === 0 ? 200 : 500;
            if (responseStatus === 200) {
                var sessionId = users.getUserByUsername(request.body.username).session.sessionId;
                response.cookie('sessionId', sessionId, {expires : Date.now() + (60 * 60 * 24 * 30)});
            } else if (responseStatus === 500) {
                response.statusText = stat.msg;
            }
            response.status(responseStatus).json(stat);
        });

    }
});
