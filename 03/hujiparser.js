/**
 * Created by Tom on 14/12/2014.
 */
var url = require('url');
var CRLF = '\r\n';

exports.parse = function (str, HttpRequestObject) {
    var httpRequestObject = new HttpRequestObject();
    httpRequestObject['body'] =  str.substr(str.indexOf(CRLF + CRLF) , str.length).trim();
    str.replace(str.indexOf(CRLF + CRLF), httpRequestObject['body'].length,"");

    var textContent = str.split(CRLF);
    var type = textContent[0].trim();
    var typeContent = type.split(' ');
    var urlPath = url.parse(typeContent[1].trim(), true);
    httpRequestObject['type'] = {};
    httpRequestObject['type']['method'] = typeContent[0].trim();
    httpRequestObject['type']['path'] = urlPath.pathname;
    httpRequestObject['type']['pathParameters'] = urlPath.query;
    httpRequestObject['type']['version'] = typeContent[2].trim();


    console.log(urlPath.pathname)
    console.log(typeContent[1].trim())


    delete textContent[0];

    httpRequestObject['headers'] = {};

    for (var index in textContent){
        var line = textContent[index].trim();
        if (line != '')
            httpRequestObject['headers'][line.substr(0, line.indexOf(':')).trim()] = line.substr(line.indexOf(':') + 1).trim();
    }
    return httpRequestObject;
};

exports.stringify = function (httpResponseObject) {
    var str_to_return = "";

    str_to_return += httpResponseObject['type'] + CRLF;
    for (var key in httpResponseObject['headers']){
        str_to_return += key + ":" + httpResponseObject['headers'][key] + CRLF;
    }
    //str_to_return += CRLF + httpResponseObject['body'];
    return str_to_return + CRLF;
};