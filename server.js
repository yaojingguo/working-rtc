"use strict"

var https = require("https");
var fs = require("fs");

var options = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/fullchain.pem")
}

var app = https.createServer(options, function(req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("HTTPS: hello, world\n");
}).listen(443, "0.0.0.0");
