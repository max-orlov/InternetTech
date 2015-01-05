var fs = require('fs');

function requestURIHandler() {
    return function (request, response, next) {
        var path = request.path.split('/');
        // TODO : configure how to get the rootdir, at the moment it can just be __dirname
        pathFinderHelper([__dirname], path);

        return next();
    }
}


// TODO : i couldn't think of any good way to do it async... =\
function pathFinderHelper(rootDirs, uriPath){
    var preFilterPaths = [];
    for (var i in rootDirs) {
        if (fs.lstatSync(rootDirs[i]).isDirectory()) {
            var tmp = fs.readdirSync(rootDirs[i]);
            for (var j in tmp) {
                var newEntry = rootDirs[i] + "\\" + tmp[j]
                preFilterPaths.push(newEntry);
            }
        }
        else{
            preFilterPaths.push(rootDirs[i])
        }
    }

    var postFilterPaths = []
    for (var i in preFilterPaths){
        if (uriPath[0].indexOf(':') === -1) {
            if (preFilterPaths[i].substr(preFilterPaths[i].lastIndexOf('\\')+1) === uriPath[0]) {
                postFilterPaths.push(preFilterPaths[i]);
            }
        }
        else{
            // This file can be anything (but only a dir)
            if (uriPath.indexOf('.') === -1)
                postFilterPaths.push(preFilterPaths[i])
        }
    }
    uriPath.splice(0,1);

    return uriPath.length === 0 ? postFilterPaths : pathFinderHelper(postFilterPaths, uriPath);

}


module.exports = requestURIHandler;


console.log(pathFinderHelper(["C:\\Users\\Maxim\\WebstormProjects\\InternetTechEx04\\03\\tests"],"restesting\\:x\\goodir\\json_file".split("\\")));
