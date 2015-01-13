var uuid = require('uuid');

var Users = function () {
    this.activeUsers = {};
};

Users.getUser = function (username) {
  return this.activeUsers(username);
};


Users.prototype.register = function (userObj) {
    var status = this.validateUser(userObj);
    if (status === 0) {
        var user = {
            fullname: userObj.fullname,
            username: userObj.username,
            password: userObj.password,
            sessionId: uuid.v1()
        };
        this.activeUsers[userObj.username] = user;
    }

    return status;
};

Users.prototype.validateUser = function (user) {
    var stat = {};

    if (!user) {
        stat = {status: 1, msg: "User is undefined"};
    } else if (!user.fullname) {
        stat = {status: 1, msg: "Fullname is empty"};
    } else if (!user.username) {
        stat = {status: 1, msg: "Username is empty"};
    } else if (!user.password) {
        stat = {status: 1, msg: "Password Is empty"};
    } else if (user.password !== user.passwordValidation) {
        stat = {status: 1, msg: "Password validation is incorrect"};
    } else if (user.username in this.activeUsers) {
        stat = {status: 1, msg: "Username + " + user.username + " is already taken"};
    } else {
        stat = {status: 0};
    }

    return stat;

};


Users.prototype.login = function (userObj) {
    var stat = {};
    var user = this.activeUsers[userObj.username];
    if (!user) {
        stat = {status: 1, msg: "User is undefined"};
    } else if (user.password !== userObj.password) {
        stat = {status: 1, msg: "Password is incorrect"};
    } else {
        stat = {status: 0, msg: ""};
        user.sessionId = uuid.v1();
    }

    return stat;
};



module.exports = Users;

