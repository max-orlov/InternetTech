var Request = function(){
    this.method = null;
    this.path = null;
    this.params = {};
    this.status = null;
    this.httpVersion = null;
    this.headers = {};
    this.body = null;
};

module.exports = Request;
