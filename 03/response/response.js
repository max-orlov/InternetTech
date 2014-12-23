var Response = function(httpVersion,statusCode, date){
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = date;
};

module.exports = Response;
