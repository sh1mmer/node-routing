var fs = require("fs"),
    sys = require("sys");
var routes = {};

exports.mapDirectory = function(directory, urlPath) {
    routes[urlPath] = [directory];
    //TODO code to sort routes by specifivity
};

exports.route = function(request, response) {
    var url = request.url;

    for (route in routes) {
        if (url.indexOf(route) === 0) {
            //viable route found
            var filename = routes[route] + url.substring(route.length);
            
            sys.log(filename);
            
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
                    response.writeHead(404, {'Content-Length': 4, 'Content-Type': 'text/plain'})
                    
                    response.end("fail");
                }
            });
            
            break;
        }
    }
}