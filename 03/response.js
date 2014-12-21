var Response = function(){
    this.version = "";
    this.status = "";
    this.headers = {};
    this.headers['Content-Type'] = "";
    this.headers['Content-Length'] = "";
};

module.exports = Response;
