var Session = require('./session'),
    uuid = require('uuid');

var Users = function () {
    this.numberOfUsers = 0;
    this.activeUsers = {};
};

/**
 * Returns the user matches the given username.in case of no match returns undefined.
 * @param username username of the wanted user.
 * @returns {*} the user matches the given username. in case of no match returns undefined.
 */
Users.prototype.getUserByUsername = function (username) {
    return this.activeUsers[username];
};

/**
 * Returns the user matches the given sessionId and the user's session doesn't expired yet. in case of no match
 * returns undefined.
 * @param sessionId session id of the wanted user.
 * @returns {*} the user matches the given sessionId and the user's session doesn't expired yet, in case of no match
 * returns undefined.
 */
Users.prototype.getUserBySessionId = function (sessionId) {
    for (var user in this.activeUsers) {
        if (this.activeUsers.hasOwnProperty(user)) {
            if (this.activeUsers[user].session.sessionId === sessionId &&
                this.activeUsers[user].session.expirationDate >= Date.now()) {
                return this.activeUsers[user];
            }
        }
    }
    return undefined;
};

/**
 * Performs registration of the new user.
 * @param userObj object containing the new user properties.
 * @returns {*} object containing the process status (0 for success, 1 for failure).
 */
Users.prototype.register = function (userObj) {
    //validating the user properties.
    var stat = this.validateUser(userObj);

    //in case the validation process succeeded.
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

/**
 * Performs validation of the properties of the given user.
 * @param user user to validate.
 * @returns {{}} object containing the process status (0 for success, 1 for failure).
 */
Users.prototype.validateUser = function (user) {
    var stat = {};
    if (!user) {
        stat = {status: 1, msg: "User doesn't exists"};
    } else if (!user.fullname) {
        stat = {status: 1, msg: "Fullname is empty"};
    } else if (!user.username) {
        stat = {status: 1, msg: "Username is empty"};
    } else if (!user.password) {
        stat = {status: 1, msg: "Password is empty"};
    } else if (!user.password) {
        stat = {status: 1, msg: "Password validation is empty"};
    } else if (user.password !== user.passwordValidation) {
        stat = {status: 1, msg: "Password validation is incorrect"};
    } else if (user.username in this.activeUsers) {
        stat = {status: 1, msg: "Username " + user.username + " is already taken"};
    } else {
        stat = {status: 0};
    }

    return stat;

};

/**
 * Performs login of a given user.
 * @param userObj the user to log in.
 * @returns {{}} object containing the process status (0 for success, 1 for failure).
 */
Users.prototype.login = function (userObj) {
    var stat = {};
    var user = this.activeUsers[userObj.username];
    //the user doesn't exists
    if (!user) {
        stat = {status: 1, msg: "User doesn't exists"};
        // the given password is incorrect.
    } else if (user.password !== userObj.password) {
        stat = {status: 1, msg: "Password is incorrect"};
        //everything is good.
    } else {
        stat = {status: 0, msg: ""};
        user.session = new Session(uuid.v1(), Date.now() + (60 * 60 * 24 * 30));
    }
    return stat;
};



module.exports = Users;

