var sys = require("sys"),
http = require("http"),
routing = require("routing");

routing.defineConfig({error: "/Users/croucher/test.txt1"})

var server = http.createServer(function (req, res) {

    routing.mapDirectory("/Users/croucher/Code/node-routing/", "/js", {error: "/Users/croucher/travel.html", execute: true});
    routing.mapDirectory("/Users/croucher/", "/");
    routing.route(req, res);
});

server.listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');