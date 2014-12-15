/**
 * Created by Tom on 14/12/2014.
 */


exports.parse = function (str) {
    var httpRequestObject={};
    var text_content = str.split('\n');
    httpRequestObject[text_content[0].substr(0,text_content[0].indexOf('/'))] = text_content[0].substr(text_content[0].indexOf('/')).trim();
    delete text_content[0];
    for (var index in text_content){
        var line = text_content[index].trim();
        if (line != '')
            httpRequestObject[line.substr(0, line.indexOf(':'))] = line.substr(line.indexOf(':') + 1).trim();
    }
    return httpRequestObject;
};

exports.stringify = function (httpResponseObject) {

};