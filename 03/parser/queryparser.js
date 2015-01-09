/**
 * Parses an HTTP request query string, and return a query object.
 * @param queryStr HTTP request query.
 * @returns {{}} an object which is the representation of the parsed query.
 */
function parseQuery(queryStr) {

    var query = {};
    var couples = queryStr.split(/&/g);
    //iterates over all the couples separated by &.
    for (var i = 0; i < couples.length; i++) {
        var couple = couples[i].split(/=/g);

        //checks that the current couple contains =, and there are name and value by it's sides.
        if (couple.length === 2) {
            var name = decodeURIComponent(couple[0].replace(/\+/g, ' '));
            var value = decodeURIComponent(couple[1].replace(/\+/g, ' '));

            //checks if the current couple is a nested object.
            var nestedObjectRegex = /(\w+)\[(\w+)]/g;
            var nestedObj = nestedObjectRegex.exec(name);
            if (!nestedObj) {
                query[name] = value;
            } else {
                var objName = nestedObj[1];
                if (!query[objName]) {
                    query[objName] = {}
                }
                var objSecondName = nestedObj[2];
                query[objName][objSecondName] = value;
            }
            //if the is no =, gives the name an empty value.
        } else if (couple.length === 1 && couple[0]) {
            name = decodeURIComponent(couple[0].replace(/\+/g, ' '));
            query[name] = "";
        }
    }
    return query;
}

exports.parseQuery = parseQuery;
