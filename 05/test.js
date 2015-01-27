var http            = require('http'),
    mimeType        = require('./settings/mimeTypes'),
    server          = require('./main');



// Starting up server
server.startServer();


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
 * @param contentLength the content length
 * @param contentType the content type
 * @returns {{host: *, port: *, path: *, method: *, headers: {Connection: *}}}
 */
function generateOptions(host, port, path, method, connection, contentLength, contentType) {
    return {
        host: host,
        port: port,
        path: path,
        method: method,
        headers : {
            Connection: connection,
            'content-length': contentLength,
            'content-type': contentType
        }
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
};
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
 * @param subStr string to print
 * @param callback the next function to run.
 */
function next(subStr, callback) {
    console.log(subStr);
    if (callback !== undefined )
            callback();
    else {
        console.log("You are done   -   Good Job!");
        server.stopServer();
    }
}

function nonExistingUserLoginTest(callback){
    var cred = JSON.stringify(user);
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', 'GET', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1)
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

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1)
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
            if (jsonRes && jsonRes.status === 0)
                next("You've passed registerNewUserTest", callback);
            else
                next("You Failed registerNewUserTest   >>  You failed to register, when you should have succeeded   >>  " + jsonRes.msg);
        })
    }).end(cred);
}

function loginInvalidPasswordTest(callback){
    var mockUser = {
        username: user.username,
        password: 'a'
    };
    var cred = JSON.stringify(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', 'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var bodySize = 0;
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            bodySize += chunk.length;
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1)
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

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            bodySize += chunk.length;
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            httpApi.cookie = response.headers['set-cookie'][0];
            if (jsonRes && jsonRes.status === 0)
                next("You've passed loginTest", callback);
            else
                next("You Failed loginTest   >>  You failed to login, when you should have succeeded " + "  >>  "  +jsonRes.msg);
        })
    }).end(cred);
}

function addToDoTest(callback){
    var newToDo = JSON.stringify(todo);
    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'POST', 'close', newToDo.length, mimeType.getMimeType('json'));
    var buff = '';
    options.headers.cookie = httpApi.cookie;

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 0)
                next("You've passed addToDoTest", callback);
            else
                next("You Failed addToDoTest   >>  You failed to add a todo item, when you should have succeeded " + "  >>  "  +jsonRes.msg);
        })
    }).end(newToDo);
}

function getListTest(callback){
    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'GET', 'close', 0, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            var todoEntry = jsonRes[0];
            todo.id = todoEntry.id;
            if (todoEntry.id === 0 && todoEntry.value.substr(todo['value']) != -1)
                next("You've passed getListTest", callback);
            else
                next("You Failed getListTest   >>  You failed to get the list " + "  >>  "  +jsonRes.msg);
        })
    }).end();
}

function updateExistingToDoTest(callback){
    var updateToDo={
        id: todo.id,
        value: todo.value + '!'
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'PUT', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0) {
                var listOpt = generateOptions(httpApi.url, httpApi.lport, '/item', 'GET', 'close', 0, mimeType.getMimeType('json'));
                listOpt.headers.cookie = httpApi.cookie;

                var listBuff = '';
                http.request(listOpt, function (response) {
                    response.on('data', function (listChunk) {
                        listBuff += listChunk;
                    });
                    response.on('end', function () {
                        var listJsonRes = JSON.parse(listBuff);
                        var todoEntry = listJsonRes[0];
                        todo.id = todoEntry.id;
                        if (todoEntry.id === 0 && todoEntry.value.substr(updateToDo['value']) != -1)
                            next("You've passed updateExistingToDoTest", callback);
                        else
                            next("You Failed updateExistingToDoTest   >>  You failed to get the list " + "  >>  "  + listJsonRes.msg);
                    })
                }).end();


            }
            else
                next("You Failed updateExistingToDoTest   >>  You failed to Update the list " + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

function updateNonExistingToDoTest(callback){
    var updateToDo={
        id: 1,
        value: todo.value + '!'
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'DELETE', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1) {
                next("You've passed updateNonExistingToDoTest", callback);
            }
            else
                next("You Failed updateNonExistingToDoTest   >>  You Manages to Update the with the wrond id " + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

function deleteToDoTest(callback) {
    var updateToDo = {
        id: todo.id
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'DELETE', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0) {
                var listOpt = generateOptions(httpApi.url, httpApi.lport, '/item', 'GET', 'close', 0, mimeType.getMimeType('json'));
                listOpt.headers.cookie = httpApi.cookie;

                var listBuff = '';
                http.request(listOpt, function (response) {
                    response.on('data', function (listChunk) {
                        listBuff += listChunk;
                    });
                    response.on('end', function () {
                        var listJsonRes = JSON.parse(listBuff);
                        if (listJsonRes.length === 0)
                            next("You've passed deleteToDoTest", callback);
                        else
                            next("You Failed deleteToDoTest   >>  You failed to get the list " + "  >>  "  + listJsonRes.msg);
                    })
                }).end();


            }
            else
                next("You Failed deleteToDoTest   >>  You failed to Update the list " + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

function deleteNotExistingToDoTest(callback){
    var updateToDo = {
        id: 1
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', 'PUT', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1) {
                next("You've passed deleteNotExistingToDoTest", callback);
            }
            else
                next("You Failed deleteNotExistingToDoTest   >>  You Manages to delete a non existing entry" + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

testSequence(
    [
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
        updateExistingToDoTest,
        updateNonExistingToDoTest,
        // Testing Deletion
        deleteNotExistingToDoTest,
        deleteToDoTest
    ]
)();
