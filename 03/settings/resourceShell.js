/**
 * Created by Maxim on 05/01/2015.
 */

var ResourceShell = function(rootDir, uri){
    this.resource = rootDir;
    this.myURI = uri;
};

ResourceShell.prototype.getResource = function(){
    return this.resource;
};

ResourceShell.prototype.getURI = function(){
    return this.myURI;
};

ResourceShell.prototype.setResource = function(res){
    this.resource = res;
};

ResourceShell.prototype.setURI = function(uri){
    this.myURI = uri;
};

ResourceShell.prototype.moveToNextURISegment = function(){
    this.myURI.splice(0,1);
}
module.exports = ResourceShell;