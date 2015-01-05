
function parseQuery(queryStr) {

    var query = {};
    var couples = queryStr.split(/&/g);

    for (var i = 0; i < couples.length; i++) {
        var couple = couples[i].split(/=/g);
        if (couple.length === 2) {
            var name = decodeURIComponent(couple[0].replace(/\+/g, ' '));
            var value = decodeURIComponent(couple[1].replace(/\+/g, ' '));

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
        }
    }
    return query;
}

exports.parseQuery = parseQuery;
