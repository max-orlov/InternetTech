var Response = function(){
    this.httpVersion = null;
    this.status = null;
    this.headers = {};
    this.headers['Content-Type'] = null;
    this.headers['Content-Length'] = null;
};

module.exports = Response;
