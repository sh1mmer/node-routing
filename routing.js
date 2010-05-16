/*
* Config object:
* Any combination of the following params
* error: location for a 404 file
* execute: run javascript files
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
    routes[urlPath] = [directory, conf];
};

exports.route = function(request, response) {
    //TODO code to sort routes by specifivity
    
    var url = request.url;
    var readRender = function(filename, c) {
        
        sys.debug(sys.inspect(c));
        sys.debug(sys.inspect(conf));
        sys.debug("Accessing: " + filename);
        
        fs.readFile(filename, function(err, data) {
            if (!err) {                
                var type = filename.substring(filename.lastIndexOf(".") + 1);

                if (type === "js" && c.execute === true) {
                    eval(data);
                } else if (type === "js") {
                    sys.debug("JavaScript disallowed");
                    //call an empty filename for this conf triggering it's error page cycle
                    //TODO fixup non 404 type errors
                    readRender("", c);
                } else {
                    if (type === "html") {
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
                }
            } else {
                if (c.error && filename !== c.error) {
                    sys.debug("File not found: displaying custom error page");
                    filename = c.error;
                    //reset conf.error to stop infinite recursion if the error file doesn't exist
                    readRender(filename, c)
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
            var directory = routes[route][0];
            var filename = directory + url.substring(route.length);
            
            //see if there is a config for this directory, otherwise use the global
            if (routes[route][1] !== undefined) {
                var c = routes[route][1];
                sys.debug(sys.inspect(routes[route][1]));
                readRender(filename, c);
            } else {
                sys.debug(sys.inspect(routes[route][1]));
                readRender(filename, conf);
            }
            
            break;
        }
    }
}