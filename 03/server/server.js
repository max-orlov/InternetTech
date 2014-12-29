/**
 * Created by Maxim on 29/12/2014.
 */

var Hujidynamicserver = function (httpVersion, statusCode) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = new(Date)().toUTCString();
    this.headers['server'] = serverSettings.serverVersion;
    this.server = null;

};

Hujidynamicserver.prototype.stop = function(){
    console.log("Stopping server");
    this.server.close();
}

Hujidynamicserver.prototype.use = function(resource, requestHandler){

}



module.exports = Hujidynamicserver;


