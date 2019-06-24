"use strict"

var http = require("http");
var https = require("https");
var fs = require("fs");

var express = require("express");
var serveIndex = require("serve-index");

var app = express();
app.use(serveIndex("./public"));
app.use(express.static("./public"));

// HTTP server
http.createServer(app).listen(80, "0.0.0.0");

// HTTPS server
var options = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/fullchain.pem")
}

https.createServer(options, app).listen(443, "0.0.0.0");
