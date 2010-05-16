var sys = require("sys"),
http = require("http"),
routing = require("routing");

var server = http.createServer(function (req, res) {
    routing.defineConfig({error: "/Users/croucher/test.txt"})
    routing.mapDirectory("/Users/croucher/Code/node-routing/", "/js");
    routing.mapDirectory("/Users/croucher/", "/");
    routing.route(req, res);
});

server.listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');