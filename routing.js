/*
* Config object:
* Any combination of the following params
* error: location for a 404 file
*
*/

var fs = require("fs"),
    sys = require("sys");
var routes = {};
var conf = {};

//TODO deal with configs on a per route basis
exports.defineConfig = function(c) {
    conf = c;
}

exports.mapDirectory = function(directory, urlPath, conf) {
    routes[urlPath] = directory;
};

exports.route = function(request, response) {
    //TODO code to sort routes by specifivity
    
    var url = request.url;
    var readRender = function(filename, conf) {
        
        sys.debug("Accessing: " + filename);
        
        fs.readFile(filename, function(err, data) {
            if (!err) {                
                var type = filename.substring(filename.lastIndexOf(".") + 1);

                if (type === "js") {
                    eval(data);
                } else if (type === "html") {
                    var config = {
                        'Content-Length': data.length,
                        'Content-Type': 'text/html'
                    };
                } else {
                    var config = {
                        'Content-Length': data.length,
                        'Content-Type': 'text/plain'
                    };
                }
                response.writeHead(200, config);
                response.end(data);
            } else {
                if (conf.error) {
                    sys.debug("File not found: displaying custom error page");
                    filename = conf.error;
                    //reset config.error to stop infinate recursion if the file doesn't exist
                    conf.error = null;
                    readRender(filename, conf)
                } else {
                    sys.debug("File not found: displaying default error page")
                    response.writeHead(404, {'Content-Length': 4, 'Content-Type': 'text/plain'})

                    response.end("fail");
                }
            }
        });

    };
    
    for (route in routes) {
        if (url.indexOf(route) === 0) {
            //viable route found
            var filename = routes[route] + url.substring(route.length);
                        
            readRender(filename, conf);
            
            break;
        }
    }
}