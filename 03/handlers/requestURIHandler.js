var fs = require('fs'),
    ResourceShell = require('./../settings/resourceShell');

function RequestURIHandler() {
    return function (request, response, next) {
        var path = request.path.split('/');
        // TODO : configure how to get the rootdir, at the moment it can just be __dirname
        pathFinderHelper([__dirname], path);

        return next();
    }
}

// TODO : now lets try the async version
function pathFinder(uri, resources, next){
    for (var i in resources){
        var currResource = resources[i];
        fs.stat(currResource.getResource(), function(err, stats){
            if (stats.isDirectory()){
                fs.readdir(currResource.getResource(), function(err, files){
                    resources.splice(i, 1);
                    for (var j in files){
                        resources.push(new ResourceShell(currResource.getResource() + "\\" + files[j]));
                        // Up to this point it should only take all the folders
                    }
                    // Filter it up
                    var filteredResources = [];
                    for (var k in resources) {
                            if (uri[0].indexOf(':') === -1) {
                                if (resources[k].getResource().substr(resources[k].getResource().lastIndexOf('\\') + 1) === uri[0]) {
                                    filteredResources.push(resources[k]);
                                }
                            }
                            else {
                                if (uri[0].indexOf('.') === -1) {
                                    filteredResources.push(resources[k]);
                                }
                            }
                    }

                    // Filter is finished
                    uri.splice(0,1);
                    return pathParser(uri, filteredResources, next)

                })
            }
        })
    }
}




function pathParser(uri, resources, next){
    if (uri.length > 0){
        pathFinder(uri, resources, next)
    }  else{
        next(resources);
    }
}

var luri = ":x\\goodir\\json_file".split("\\");
var lresources = [];
lresources.push(new ResourceShell("C:\\Users\\Maxim\\WebstormProjects\\InternetTechEx04\\03\\tests\\restesting"));

pathParser(luri,lresources, function(resources){
    console.log(resources);
});


module.exports = RequestURIHandler;


//console.log(pathFinderHelper(["C:\\Users\\Maxim\\WebstormProjects\\InternetTechEx04\\03\\tests"],"restesting\\:x\\goodir\\json_file".split("\\")));

//pathFinder("C:\\Users\\Maxim\\WebstormProjects\\InternetTechEx04\\03\\tests","restesting\\:x\\goodir\\json_file".split("\\"));

//// TODO : i couldn't think of any good way to do it async... =\
//function pathFinderHelper(rootDirs, uriPath){
//    var preFilterPaths = [];
//    for (var i in rootDirs) {
//        if (fs.lstatSync(rootDirs[i]).isDirectory()) {
//            var tmp = fs.readdirSync(rootDirs[i]);
//            for (var j in tmp) {
//                var newEntry = rootDirs[i] + "\\" + tmp[j]
//                preFilterPaths.push(newEntry);
//            }
//        }
//        else{
//            preFilterPaths.push(rootDirs[i])
//        }
//    }
//
//    var postFilterPaths = []
//    for (var i in preFilterPaths){
//        if (uriPath[0].indexOf(':') === -1) {
//            if (preFilterPaths[i].substr(preFilterPaths[i].lastIndexOf('\\')+1) === uriPath[0]) {
//                postFilterPaths.push(preFilterPaths[i]);
//            }
//        }
//        else{
//            // This file can be anything (but only a dir)
//            if (uriPath.indexOf('.') === -1)
//                postFilterPaths.push(preFilterPaths[i])
//        }
//    }
//    uriPath.splice(0,1);
//
//    return uriPath.length === 0 ? postFilterPaths : pathFinderHelper(postFilterPaths, uriPath);
//
//}