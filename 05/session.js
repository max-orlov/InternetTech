

var Session = function (sessionId, expirationDate) {
    this.sessionId = sessionId;
    this.expirationDate = expirationDate;
};

module.exports = Session;