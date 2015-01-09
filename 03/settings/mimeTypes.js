var mimeTypes  = {
    js: 'application/javascript',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    png: 'image/png',
    ico: 'image/x-ico',
    buffer: 'application/octet-stream',
    json: 'application/json',
    xform: 'application/x-www-form-urlencoded'
};

/**
 * Return the given mime type value.
 * @param name the given mime type.
 * @returns {*} the given mime type value.
 */
var getMimeType = function(name) {
    return mimeTypes[name];
};

/**
 * Checks is the given mime type is supported.
 * @param value the value of the mime type.
 * @returns {boolean} true if the given mime type is supported, otherwise returns false.
 */
var hasMimeType = function (value) {
    for(var key in mimeTypes) {
        if(mimeTypes.hasOwnProperty(key)) {
            if(mimeTypes[key].toLowerCase() === value.toLowerCase()) {
                return true
            }
        }
    }
    return false;
};

exports.getMimeType = getMimeType;
exports.hasMimeType = hasMimeType;