var hujiwebserver   = require('./ex4/hujiwebserver'),
    Data            = require('./data'),
    Users           = require('./users');


hujiwebserver.start(8888, function (e, server) {
    if (e) {
        console.log(e);
    } else {
        var data = new Data();
        var users = new Users();
        server.use('/app', hujiwebserver.static('/www/'));

        server.get('/item', function (request, response) {
            response.json(data.list());
        });

        server.post('/item', function (request, response) {
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            if (user) {
                request.body.owner = user.id;
                var stat = data.create(request.body);
                response.status(stat.status === 0 ? 200 : 500).json(stat);
            }
        });

        server.put('/item', function (request, response) {
            var stat = data.update(request.body);
            var responseStatus = stat.status === 0 ? 200 : 500;
            if (responseStatus === 500) {
                response.statusText = stat.msg;
            }
            response.status(responseStatus).json(stat);
        });

        server.delete('/item', function (request, response) {
            var stat = data.delete(request.body);
            var responseStatus = stat.status === 0 ? 200 : 500;
            if (responseStatus === 500) {
                response.statusText = stat.msg;
            }
            response.status(responseStatus).json(stat);
        });



        server.post('/register', function (request, response) {
            var stat = users.register(request.body);
            var responseStatus = stat.status === 0 ? 200 : 500;
            if (responseStatus === 200) {
                response.cookie('sessionId', users.getUserByUsername(request.body.username).session.sessionId);
            } else if (responseStatus === 500) {
                response.statusText = stat.msg;
            }
            response.status(responseStatus).json(stat);
        });

        server.post('/login', function (request, response) {
            var stat = users.login(request.body);
            var responseStatus = stat.status === 0 ? 200 : 500;
            if (responseStatus === 200) {
                response.cookie('sessionId', users.getUserByUsername(request.body.username).session.sessionId);
            } else if (responseStatus === 500) {
                response.statusText = stat.msg;
            }
            response.status(responseStatus).json(stat);
        });

    }
});
