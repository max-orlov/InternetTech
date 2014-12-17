/**
 * Created by Tom on 14/12/2014.
 */

exports.parse = function (str) {
    var httpRequestObject={};
    httpRequestObject['body'] =  str.substr(str.indexOf('\r\n\r\n')+4 , str.length);
    str.replace(str.indexOf('\r\n\r\n'), httpRequestObject['body'].length,"");

    var text_content = str.split('\n');
    var type = text_content[0].trim();
    var type_content = type.split(' ');
    httpRequestObject['type'] = {};
    httpRequestObject['type']['method'] = type_content[0].trim();
    httpRequestObject['type']['path'] = type_content[1].trim();
    httpRequestObject['type']['version'] = type_content[2].trim();

    delete text_content[0];

    httpRequestObject['headers'] = {};

    for (var index in text_content){
        var line = text_content[index].trim();
        if (line != '')
            httpRequestObject['headers'][line.substr(0, line.indexOf(':'))] = line.substr(line.indexOf(':') + 1).trim();
    }
    return httpRequestObject;
};

exports.stringify = function (httpResponseObject) {
    var str_to_return = "";

    str_to_return += httpResponseObject['type'] + "\r\n";
    for (var key in httpResponseObject['headers']){
        str_to_return += key + ":" + httpResponseObject['headers'][key] + "\r\n";
    }
    str_to_return += "\r\n" + httpResponseObject['body'];
    console.log(str_to_return);
    return str_to_return;
};