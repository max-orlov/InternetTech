var http            = require('http'),
    serverSetting   = require('./settings/settings'),
    mimeType        = require('./settings/mimeTypes'),
    hujiwebserver   = require('./hujiwebserver'),
    Data            = require('./Data'),
    Users           = require('./users');

// Starting up server
var myServer;

hujiwebserver.start(8888, function (e, server) {
    if (e) {
        console.log(e);
    } else {
        var data = new Data();
        var users = new Users();
        myServer = server;
        server.use('/app', hujiwebserver.static('/www/'));

        server.get('/aloha', function(request, response){
            var user = users.getUserBySessionId(request.cookies['sessionId']);
            response.status(200);
            if (user){
                response.json({list: data.list(user.id), listSize: data.todos.size()});
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
                response.json({tasksRemain: data.tasksRemain, totalListSize: data.todos.size()})
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
                response.json(data.list(user.id));
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
                var stat = data.create(request.body);
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
                var stat = data.update(request.body, user.id);
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
                var stat = data.delete(request.body.id , user.id);
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

var httpApi={
    url: 'localhost',
    lport: 8888,
    cookies: ''
    };

/**
 * Generates the options for an http request
 * @param host the host of the request
 * @param port the port of the request
 * @param path the path required
 * @param method the method of the request
 * @param connection the connection of the request
 * @returns {{host: *, port: *, path: *, method: *, headers: {Connection: *}}}
 */
function generateOptions(host, port, path, method, connection, contentLength, contentType, cookie) {
    return {
        host: host,
        port: port,
        path: path,
        method: method,
        headers : {Connection: connection,
            'content-length': contentLength,
            'content-type': contentType}
    }
}

var user = {
    fullname: 'fullName',
    username: "user",
    password: "pass",
    passwordValidation: "pass"
};

var todo = {
    value: 'todoTest',
    status: 0
}
/**
 * Creates a test sequence by creating a callback chain.
 * @param funcs the functions to chain together.
 * @returns {*}
 */
function testSequence(funcs) {
    for (var i = funcs.length - 1 ; i > 0  ; --i) {
        funcs[i - 1] = funcs[i - 1].bind(funcs[i -1], funcs[i]);
    }
    return funcs[0];
}


/**
 * Calls for the next test to be run
 * @param callback the next function to run.
 */
function next(subStr, callback) {
    console.log(subStr);
    if (callback !== undefined )
            callback();
    else {
        console.log("You are done   -   Good Job!");
        //myServer.stop();
    }

}


function nonExistingUserLoginTest(callback){
    var cred = JSON.stringify(user);
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', 'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1)
                next("You've passed nonExistingUserLoginTest", callback);
            else
                next("You Failed nonExistingUserLoginTest   >>  You were not suppose to able to login with unregistered: " + user.username + "  >>  "  +jsonRes.msg);
        })
    }).end(cred);
}

function registerNewUserInvalidPasswordValidationTest(callback){
    user.passwordValidation = 'a';
    var cred = JSON.stringify(user);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', 'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    var req = http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1)
                next("You've passed registerNewUserInvalidPasswordValidationTest", callback);
            else
                next("You Failed registerNewUserInvalidPasswordValidationTest   >>  You should have gotten an error while trying to register, as " +
                user.password + "!=" + user.passwordValidation + "  >>  "  + jsonRes.msg);
        })
    }).end(cred);
}

function registerNewUserTest(callback){
    user.passwordValidation = user.password;
    var cred = JSON.stringify(user);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', 'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0)
                next("You've passed registerNewUserTest", callback);
            else
                next("You Failed registerNewUserTest   >>  You failed to register, when you should have succeeded   >>  " + jsonRes.msg);
        })
    }).end(cred);
}

function loginInvalidPasswordTest(callback){
    var mockUser={
        username: user.username,
        password: 'a'
    }
    var cred = JSON.stringify(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', 'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var bodySize = 0;
    var buff = '';

    var req = http.request(options, function (response) {
        response.on('data', function (chunk) {
            bodySize += chunk.length;
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1)
                next("You've passed loginInvalidPasswordTest", callback);
            else
                next("You Failed loginInvalidPasswordTest   >>  You should have gotten an error while trying to login, as " +
                mockUser.password + "!=" + user.password + "  >>  "  +jsonRes.msg);
        })
    }).end(cred);
}

function loginTest(callback){
    var cred = JSON.stringify(user);
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', 'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var bodySize = 0;
    var buff = '';

    var req = http.request(options, function (response) {
        response.on('data', function (chunk) {
            bodySize += chunk.length;
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            httpApi.cookie = response.headers['set-cookie'][0];
            if (jsonRes.status === 0)
                next("You've passed loginTest", callback);
            else
                next("You Failed loginTest   >>  You failed to login, when you should have succeeded " + "  >>  "  +jsonRes.msg);
        })
    }).end(cred);
}

function addToDoTest(callback){
    var newToDo = JSON.stringify(todo);
    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'POST', 'close', newToDo.length, mimeType.getMimeType('json'), httpApi.cookie);
    var buff = '';
    options.headers.cookie = httpApi.cookie;

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            todo.id = jsonRes.id;
            if (jsonRes.status === 0)
                next("You've passed addToDoTest", callback);
            else
                next("You Failed addToDoTest   >>  You failed to add a todo item, when you should have succeeded " + "  >>  "  +jsonRes.msg);
        })
    }).end(newToDo);
}

function getListTest(callback){
    var newToDo = JSON.stringify(todo);
    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'GET', 'close', newToDo.length);
    options.headers.cookie = httpApi.cookie;
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            console.log(jsonRes);
            var todoEntry = jsonRes[0]
            if (todoEntry.id === 0 && todoEntry.value.substr(todo['value']) != -1)
                next("You've passed getListTest", callback);
            else
                next("You Failed getListTest   >>  You failed to get the list " + "  >>  "  +jsonRes.msg);
        })
    }).end(newToDo);
}



function updateExistsingToDoTest(callback){

}

function updateNonExistingToDoTest(callback){

}

function deleteToDOTest(callback) {

}
var first = testSequence([
        // Testing the login and register
        nonExistingUserLoginTest,
        registerNewUserInvalidPasswordValidationTest,
        registerNewUserTest,
        loginInvalidPasswordTest,
        loginTest,

        // Testing Addition
        addToDoTest,

        // Testing List return
        getListTest,

        // Testing Updating
        updateExistsingToDoTest,
        updateNonExistingToDoTest,

        // Testing Deletion
        deleteToDOTest

    ]);
first();