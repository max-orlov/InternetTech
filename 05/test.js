var http            = require('http'),
    mimeType        = require('./settings/mimeTypes'),
    server          = require('./main');




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
 * @param username the username for xform type request
 * @param password the password for xform type request
 * @param method the method of the request
 * @param connection the connection of the request
 * @param contentLength the content length
 * @param contentType the content type
 * @returns {{host: *, port: *, path: *, method: *, headers: {Connection: *}}}
 */
function generateOptions(host, port, path, username, password, method, connection, contentLength, contentType) {
    return {
        host: host,
        port: port,
        path: path + (username ?
            ("?username=" + username + "&password=" + password) : ""),
        method: method,
        headers : {
            Connection: connection,
            'content-length': contentLength,
            'content-type': contentType
        }
    }
}

/**
 * The basic user
 * @type {{fullname: string, username: string, password: string, passwordValidation: string}}
 */
var baseUser = {
    fullname: "fullName",
    username: "jsonUser",
    password: "pass",
    passwordValidation: "pass"
};

/**
 * A user for the json tests
 * @type {{}}
 */
var jsonUser = alterUser(baseUser, 'json');
/**
 * A user for the xform tests
 * @type {{}}
 */
var xFormUser = alterUser(baseUser, 'xform');

/**
 * This function creates a new user from the bleuprint of the given user.
 * @param user the blueprint of a user
 * @param postfix a postifx to attach to each field.
 * @returns {{}} a new user
 */
function alterUser(user, postfix){
    var newUser = {};
    if (user)
    for (var key in user) {
            if (user[key])
            newUser[key] = user[key] + postfix;
        }

    return newUser;
}

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
    for (var i = funcs.length  ; i > 0  ; --i) {
        funcs[i - 1] = funcs[i - 1].bind(funcs[i -1], i , funcs[i]);
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
        console.log("You are done");
        //server.stopServer();
    }
}

/**
 * Converts a json into xform type string
 * @param jsonObject the object to convert
 * @returns {string} as tring of xform which is equivelent to the json given
 */
function jsonToXForm(jsonObject) {
    var strToReturn = '';
    if (jsonObject) {
        for (var key in jsonObject) {
            if (jsonObject[key])
                strToReturn += key + '=' + jsonObject[key] + '&'
        }
    }
    strToReturn = strToReturn.substr(0, strToReturn.length-1);
    return strToReturn
}

/**
 * A test which tests trying to log in with a non existing user.
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function nonExistingUserLoginTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', jsonUser.username, jsonUser.password
        , 'GET', 'close', 0, '');
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
                next("You Failed nonExistingUserLoginTest   >>" +
                "  You were not suppose to able to login with unregistered: " + jsonUser.username + "  >> " +
                " "  +jsonRes.msg);
        })
    }).end();
}

/**
 * A test which tests trying to log in with an incorrect password
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function loginInvalidPasswordTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var mockUser = {
        username: jsonUser.username,
        password: 'a'
    };
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', mockUser.username, mockUser.password,
        'GET', 'close', 0, '');
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1 && jsonRes.msg.indexOf('Password is incorrect') !== -1)
                next("You've passed loginInvalidPasswordTest", callback);
            else
                next("You Failed loginInvalidPasswordTest   >>" +
                "  You should have gotten an error while trying to login, as " +
                mockUser.password + "!=" + jsonUser.password + "  >>  "  +jsonRes.msg);
        })
    }).end();
}

/**
 * A test which tests if it is possible to log in.
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function loginTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var options = generateOptions(httpApi.url, httpApi.lport, '/login', jsonUser.username, jsonUser.password,
        'GET', 'close', 0, '');
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            httpApi.cookie = response.headers['set-cookie'][0];
            if (jsonRes && jsonRes.status === 0)
                next("You've passed loginTest", callback);
            else
                next("You Failed loginTest   >>  You failed to login, when you should have succeeded " + "  >>" +
                "  "  +jsonRes.msg);
        })
    }).end();
}

/**
 * A test which tests getting back the todo list.
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function getListTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '', 'GET', 'close', 0, '');
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

// JSON content-type register tests
/**
 * A test which tests trying to register with an invalid validation password (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserInvalidPasswordValidationJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var mockUser = {
        fullname: jsonUser.fullname,
        username: jsonUser.username,
        password: jsonUser.password,
        passwordValidation: 'a'
    };
    var cred = JSON.stringify(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1)
                next("You've passed registerNewUserInvalidPasswordValidationJsonTest", callback);
            else
                next("You Failed registerNewUserInvalidPasswordValidationJsonTest   >>" +
                "  You should have gotten an error while trying to register, as " +
                jsonUser.password + "!=" + jsonUser.passwordValidation + "  >>  " + jsonRes.msg);
            }
        )
    }).end(cred);
}

/**
 * A test which tests trying to register with an empty fullname (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserInvalidFullNameJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var mockUser = {
        fullname: '',
        username: jsonUser.username,
        password: jsonUser.password,
        passwordValidation: jsonUser.passwordValidation
    };
    var cred = JSON.stringify(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
                var jsonRes = JSON.parse(buff);
                if (jsonRes && jsonRes.status === 1)
                    next("You've passed registerNewUserInvalidFullNameJsonTest", callback);
                else
                    next("You Failed registerNewUserInvalidFullNameJsonTest   >>" +
                    "  You should have gotten an error while trying to register, with fullName="
                    + jsonUser.fullname + "  >>  " + jsonRes.msg);
            }
        )
    }).end(cred);
}

/**
 * A test which tests trying to register with an empty username (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserInvalidUserNameJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var mockUser = {
        fullname: jsonUser.fullname,
        username: '',
        password: jsonUser.password,
        passwordValidation: jsonUser.passwordValidation
    };
    var cred = JSON.stringify(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
                var jsonRes = JSON.parse(buff);
                if (jsonRes && jsonRes.status === 1)
                    next("You've passed registerNewUserInvalidUserNameJsonTest", callback);
                else
                    next("You Failed registerNewUserInvalidUserNameJsonTest   >>" +
                    "  You should have gotten an error while trying to register, as username=" +
                    jsonUser.username + "  >>  " + jsonRes.msg);
            }
        )
    }).end(cred);
}

/**
 * A test which tests registering a new valid user (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    jsonUser.passwordValidation = jsonUser.password;
    var cred = JSON.stringify(jsonUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 0)
                next("You've passed registerNewUserJsonTest", callback);
            else
                next("You Failed registerNewUserJsonTest   >>" +
                "  You failed to register, when you should have succeeded   >>  " + jsonRes.msg);
        })
    }).end(cred);
}

/**
 * A test which test trying to register to an already existing username (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerExistingUserJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var mockUser={
        fullname: 'a',
        username: jsonUser.username,
        password: 'b',
        passwordValidation: 'b'

    };
    var cred = JSON.stringify(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('json'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1)
                next("You've passed registerExistingUserJsonTest", callback);
            else
                next("You Failed registerExistingUserJsonTest   >>" +
                "  You succeded registering, although you shouldn't have, as the jsonUser :"
                + mockUser.username + "already exists");
        })
    }).end(cred);
}

/**
 * A test which tests trying to add a new todo (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function addToDoJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var newToDo = JSON.stringify(todo);
    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'POST', 'close', newToDo.length, mimeType.getMimeType('json'));
    var buff = '';
    options.headers.cookie = httpApi.cookie;

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 0)
                next("You've passed addToDoJsonTest", callback);
            else
                next("You Failed addToDoJsonTest   >>  You failed to add a todo item, when you should have succeeded" +
                " " + "  >>  "  +jsonRes.msg);
        })
    }).end(newToDo);
}

/**
 * A test which tests trying to update a non existing todo (json based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function updateNonExistingToDoJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var updateToDo={
        id: 1,
        value: todo.value + '!'
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'DELETE', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1) {
                next("You've passed updateNonExistingToDoJsonTest", callback);
            }
            else
                next("You Failed updateNonExistingToDoJsonTest   >>" +
                "  You Manages to Update the with the wrond id " + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

/**
 * A test which tests trying to update a valid todo (json based submission form)
 * @param testIndex
 * @param callback
 */
function updateExistingToDoJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var updateToDo={
        id: todo.id,
        value: todo.value + '!'
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'PUT', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0) {
                var listOpt = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
                    'GET', 'close', 0, mimeType.getMimeType('json'));
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
                            next("You've passed updateExistingToDoJsonTest", callback);
                        else
                            next("You Failed updateExistingToDoJsonTest   >>  You failed to get the list "
                            + "  >>  "  + listJsonRes.msg);
                    })
                }).end();


            }
            else
                next("You Failed updateExistingToDoJsonTest   >>  You failed to Update the list "
                + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

/**
 * A test which tests try to delete a non existing todo (json based submission form)
 * @param testIndex
 * @param callback
 */
function deleteNonExistingToDoJsonTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var updateToDo = {
        id: 1
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'PUT', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1) {
                next("You've passed deleteNonExistingToDoJsonTest", callback);
            }
            else
                next("You Failed deleteNonExistingToDoJsonTest   >> " +
                " You Manages to delete a non existing entry" + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

/**
 * A test which tests deleting a valid todo (json based submission form)
 * @param testIndex
 * @param callback
 */
function deleteToDoJsonTest(testIndex, callback) {
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var updateToDo = {
        id: todo.id
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'DELETE', 'close', updateToDoStr.length, mimeType.getMimeType('json'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0) {
                var listOpt = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
                    'GET', 'close', 0, mimeType.getMimeType('json'));
                listOpt.headers.cookie = httpApi.cookie;

                var listBuff = '';
                http.request(listOpt, function (response) {
                    response.on('data', function (listChunk) {
                        listBuff += listChunk;
                    });
                    response.on('end', function () {
                        var listJsonRes = JSON.parse(listBuff);
                        if (listJsonRes.length === 0)
                            next("You've passed deleteToDoJsonTest", callback);
                        else
                            next("You Failed deleteToDoJsonTest   >>  You failed to get the list " +
                            "  >>  "  + listJsonRes.msg);
                    })
                }).end();


            }
            else
                next("You Failed deleteToDoJsonTest   >>  You failed to Update the list " +
                "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

// xform content-type register tests
/**
 * A test which tests trying to register with an invalid validation password (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserInvalidPasswordValidationXformTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var mockUser = {
        fullname: xFormUser.fullname,
        username: xFormUser.username,
        password: xFormUser.password,
        passwordValidation: 'a'
    };
    jsonUser.passwordValidation = 'a';
    var cred = jsonToXForm(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('xform'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
                var jsonRes = JSON.parse(buff);
                if (jsonRes && jsonRes.status === 1)
                    next("You've passed registerNewUserInvalidPasswordValidationXformTest", callback);
                else
                    next("You Failed registerNewUserInvalidPasswordValidationXformTest   >>" +
                    "  You should have gotten an error while trying to register, as " +
                    xFormUser.password + "!=" + xFormUser.passwordValidation + "  >>  " + jsonRes.msg);
            }
        )
    }).end(cred);
}

/**
 * A test which tests trying to register with an empty fullname (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserInvalidFullNameXformTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var mockUser = {
        fullname: '',
        username: xFormUser.username,
        password: xFormUser.password,
        passwordValidation: xFormUser.passwordValidation
    };
    var cred = jsonToXForm(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('xform'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
                var jsonRes = JSON.parse(buff);
                if (jsonRes && jsonRes.status === 1)
                    next("You've passed registerNewUserInvalidPasswordValidationXformTest", callback);
                else
                    next("You Failed registerNewUserInvalidFullNameJsonTest   >> " +
                    " You should have gotten an error while trying to register, with fullanme=" +
                    xFormUser.fullname + "  >>  " + jsonRes.msg);
            }
        )
    }).end(cred);
}

/**
 * A test which tests trying to register with an empty username (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserInvalidUserNameXformTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var mockUser = {
        fullname: xFormUser.fullname,
        username: '',
        password: xFormUser.password,
        passwordValidation: xFormUser.passwordValidation
    };
    var cred = jsonToXForm(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('xform'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
                var jsonRes = JSON.parse(buff);
                if (jsonRes && jsonRes.status === 1)
                    next("You've passed registerNewUserInvalidUserNameXformTest", callback);
                else
                    next("You Failed registerNewUserInvalidUserNameJsonTest   >> " +
                    " You should have gotten an error while trying to register, as username=" +
                    xFormUser.username + "  >>  " + jsonRes.msg);
            }
        )
    }).end(cred);
}

/**
 * A test which tests registering a new valid user (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function registerNewUserXformTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    jsonUser.passwordValidation = jsonUser.password;
    var cred = jsonToXForm(xFormUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('xform'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 0)
                next("You've passed registerNewUserXformTest", callback);
            else
                next("You Failed registerNewUserXformTest   >>" +
                "  You failed to register, when you should have succeeded   >>  " + jsonRes.msg);
        })
    }).end(cred);
}

/**
 * A test which test trying to register to an already existing username (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */

function registerExistingUserXformTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var mockUser={
        fullname: 'a',
        username: xFormUser.username,
        password: 'b',
        passwordValidation: 'b'

    };
    var cred = jsonToXForm(mockUser);
    var options = generateOptions(httpApi.url, httpApi.lport, '/register', '', '',
        'POST', 'close', cred.length, mimeType.getMimeType('xform'));
    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 1)
                next("You've passed registerExistingUserXformTest", callback);
            else
                next("You Failed registerExistingUserXformTest   >>" +
                "  You succeded registering, although you shouldn't have, as the jsonUser :" +
                mockUser.username + "already exists");
        })
    }).end(cred);
}

/**
 * A test which tests trying to add a new todo (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function addToDoXFormTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var newToDo = jsonToXForm(todo);
    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'POST', 'close', newToDo.length, mimeType.getMimeType('xform'));
    var buff = '';
    options.headers.cookie = httpApi.cookie;

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes && jsonRes.status === 0) {
                todo.id++;
                next("You've passed addToDoXFormTest", callback);
            }
            else
                next("You Failed addToDoXFormTest   >>" +
                "  You failed to add a todo item, when you should have succeeded " + "  >>  "  +jsonRes.msg);
        })
    }).end(newToDo);
}

/**
 * A test which tests trying to update a valid todo (xform based submission form)
 * @param testIndex
 * @param callback
 */
function updateExistingToDoXFormTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var updateToDo={
        id: todo.id ,
        value: todo.value + '!'
    };
    var updateToDoStr = jsonToXForm(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'PUT', 'close', updateToDoStr.length, mimeType.getMimeType('xform'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0) {
                var listOpt = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
                    'GET', 'close', 0, mimeType.getMimeType('json'));
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
                        if (todoEntry.id === 1 && todoEntry.value.substr(updateToDo['value']) != -1)
                            next("You've passed updateExistingToDoXFormTest", callback);
                        else
                            next("You Failed updateExistingToDoXFormTest   >>" +
                            "  You failed to get the list " + "  >>  "  + listJsonRes.msg);
                    })
                }).end();


            }
            else
                next("You Failed updateExistingToDoXFormTest   >>" +
                "  You failed to Update the list " + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

/**
 * A test which tests trying to update a non existing todo (xform based submission form)
 * @param testIndex the test index
 * @param callback the next function to be called.
 */
function updateNonExistingToDoXFormTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var updateToDo={
        id: todo.id + 1,
        value: todo.value + '!'
    };
    var updateToDoStr = JSON.stringify(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'DELETE', 'close', updateToDoStr.length, mimeType.getMimeType('xform'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1) {
                next("You've passed updateNonExistingToDoXFormTest", callback);
            }
            else
                next("You Failed updateNonExistingToDoXFormTest   >>" +
                "  You Manages to Update the with the wrond id " + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

/**
 * A test which tests deleting a valid todo (xform based submission form)
 * @param testIndex
 * @param callback
 */
function deleteToDoXFormTest(testIndex, callback) {
    process.stdout.write('starting test number ' + testIndex + '    >>  ');

    var deleteToDo = {
        id: todo.id
    };
    var updateToDoStr = jsonToXForm(deleteToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'DELETE', 'close', updateToDoStr.length, mimeType.getMimeType('xform'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 0) {
                var listOpt = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
                    'GET', 'close', 0, '');
                listOpt.headers.cookie = httpApi.cookie;

                var listBuff = '';
                http.request(listOpt, function (response) {
                    response.on('data', function (listChunk) {
                        listBuff += listChunk;
                    });
                    response.on('end', function () {
                        var listJsonRes = JSON.parse(listBuff);
                        if (listJsonRes.length === 0)
                            next("You've passed deleteToDoXFormTest", callback);
                        else
                            next("You Failed deleteToDoXFormTest   >>  You failed to get the list " +
                            "  >>  "  + listJsonRes.msg);
                    })
                }).end();


            }
            else
                next("You Failed deleteToDoXFormTest   >>  You failed to Update the list " +
                "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

/**
 * A test which tests try to delete a non existing todo (xform based submission form)
 * @param testIndex
 * @param callback
 */
function deleteNonExistingToDoXFormTest(testIndex, callback){
    process.stdout.write('starting test number ' + testIndex + '    >>  ');
    var updateToDo = {
        id: todo.id + 1
    };
    var updateToDoStr = jsonToXForm(updateToDo);

    var options = generateOptions(httpApi.url, httpApi.lport, '/item', '', '',
        'PUT', 'close', updateToDoStr.length, mimeType.getMimeType('xform'));
    options.headers.cookie = httpApi.cookie;

    var buff = '';

    http.request(options, function (response) {
        response.on('data', function (chunk) {
            buff += chunk;
        });
        response.on('end', function () {
            var jsonRes = JSON.parse(buff);
            if (jsonRes.status === 1) {
                next("You've passed deleteNonExistingToDoXFormTest", callback);
            }
            else
                next("You Failed deleteNonExistingToDoXFormTest   >>" +
                "  You Manages to delete a non existing entry" + "  >>  "  + jsonRes.status);
        })
    }).end(updateToDoStr);
}

// Suites
/**
 * This suite tests all the login functions and the JSON type content-types.
 * @param suiteIndex the number of the suite
 * @param callback a callback to the next suite
 */
function jsonSuite(suiteIndex, callback){
    console.log('~~~starting json based number ' + suiteIndex + '~~~');

    testSequence(
        [
            // Testing the login and register
            nonExistingUserLoginTest,
            registerNewUserInvalidPasswordValidationJsonTest,
            registerNewUserInvalidFullNameJsonTest,
            registerNewUserInvalidUserNameJsonTest,
            registerNewUserJsonTest,
            registerExistingUserJsonTest,


            loginInvalidPasswordTest,
            loginTest,

            // Testing Addition
            addToDoJsonTest,
            // Testing List return
            getListTest,
            // Testing Updating
            updateExistingToDoJsonTest,
            updateNonExistingToDoJsonTest,
            // Testing Deletion
            deleteNonExistingToDoJsonTest,
            deleteToDoJsonTest,
            callback

        ]
    )();
}

/**
 * This suite tests all the xform type content-types.
 * @param suiteIndex the number of the suite
 * @param callback a callback to the next suite
 */
function xFormSuite(suiteIndex) {
    console.log('~~~starting xform based number ' + suiteIndex + '~~~');

    testSequence(
        [
            // Testing the login and register
            registerNewUserInvalidPasswordValidationXformTest,
            registerNewUserInvalidFullNameXformTest,
            registerNewUserInvalidUserNameXformTest,
            registerNewUserXformTest,
            registerExistingUserXformTest,

            loginTest,
            // Testing Addition
            addToDoXFormTest,
            // Testing Updating
            updateExistingToDoXFormTest,
            updateNonExistingToDoXFormTest,
            // Testing Deletion
            deleteToDoXFormTest,
            deleteNonExistingToDoXFormTest,
            server.stopServer
        ]
    )();
}

testSequence([jsonSuite, xFormSuite])();
