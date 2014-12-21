var Request = function(){
    this.method = "";
    this.path = "";
    this.params = "";
    this.version = "";
    this.headers = {};
    this.body = "";
};

module.exports = Request;
