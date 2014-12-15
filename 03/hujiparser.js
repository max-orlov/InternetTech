/**
 * Created by Tom on 14/12/2014.
 */


exports.parse = function (str) {
    var httpRequestObject={};
    var textcontent = str.split('\n');
    httpRequestObject[textcontent[0].substr(0,textcontent[0].indexOf('/'))] = textcontent[0].substr(textcontent[0].indexOf('/')).trim();
    delete textcontent[0];
    for (var index in textcontent){
        var line = textcontent[index].trim();
        if (line != '')
            httpRequestObject[line.substr(0, line.indexOf(':'))] = line.substr(line.indexOf(':') + 1).trim();
    }
    return httpRequestObject;
};

exports.stringify = function (httpResponseObject) {

};