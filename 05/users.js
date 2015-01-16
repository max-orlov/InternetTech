var Session = require('./session'),
    uuid = require('uuid');

var Users = function () {
    this.numberOfUsers = 0;
    this.activeUsers = {};
};

Users.prototype.getUserByUsername = function (username) {
  return this.activeUsers[username];
};

Users.prototype.getUserBySessionId = function (sessionId) {
    for (var user in this.activeUsers) {
        if (this.activeUsers.hasOwnProperty(user)) {
            if (this.activeUsers[user].session.sessionId === sessionId &&
                this.activeUsers[user].session.expirationDate >= Date.now()) {
                return user;
            }
        }
    }
    return undefined;
};


Users.prototype.register = function (userObj) {
    var stat = this.validateUser(userObj);

    if (stat.status === 0) {
        this.numberOfUsers++;
        this.activeUsers[userObj.username] = {
            id: this.numberOfUsers,
            fullname: userObj.fullname,
            username: userObj.username,
            password: userObj.password,
            session: new Session(uuid.v1(), Date.now() + (60 * 60 * 24 * 30))
        };
    }
    return stat;
};

Users.prototype.validateUser = function (user) {
    var stat = {};
    if (!user) {
        stat = {status: 1, msg: "User doesn't exists"};
    } else if (!user.fullname) {
        stat = {status: 1, msg: "Fullname is empty"};
    } else if (!user.username) {
        stat = {status: 1, msg: "Username is empty"};
    } else if (!user.password) {
        stat = {status: 1, msg: "Password Is empty"};
    } else if (user.password !== user.passwordValidation) {
        stat = {status: 1, msg: "Password validation is incorrect"};
    } else if (user.username in this.activeUsers) {
        stat = {status: 1, msg: "Username " + user.username + " is already taken"};
    } else {
        stat = {status: 0};
    }

    return stat;

};


Users.prototype.login = function (userObj) {
    var stat = {};
    var user = this.activeUsers[userObj.username];
    if (!user) {
        stat = {status: 1, msg: "User doesn't exists"};
    } else if (user.password !== userObj.password) {
        stat = {status: 1, msg: "Password is incorrect"};
    } else {
        stat = {status: 0, msg: ""};
        user.session = new Session(uuid.v1(), Date.now() + (60 * 60 * 24 * 30))
    }

    return stat;
};



module.exports = Users;

