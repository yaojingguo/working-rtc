"use strict"

var http = require("http");
var https = require("https");
var fs = require("fs");

var express = require("express");
var serveIndex = require("serve-index");

var socketIo = require("socket.io");

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

var https_server = https.createServer(options, app);
var io = socketIo.listen(https_server);

io.sockets.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    var myRoom = io.sockets.adapter.rooms[room];
    var users = Object.keys(myRoom.sockets).length;
    console.log(`after joining ${room} room, user count ${users}`);
    // socket.emit("joined", room, socket.id);
    // socket.to(room).emit("joined", room, socket.id);
    io.in(room).emit("joined", room, socket.id);
    // socket.broadcast.emit("joined", room, socket.id);
  });
  socket.on("leave", (room) => {
    socket.leave(room);
    var users = Object.keys(myRoom.sockets).length;
    console.log(`after leaving, user count ${users-1}`);
    // socket.emit("left", room, socket.id);
    // socket.to(room).emit("left", room, socket.id);
    // io.in(room).emit("left", room, socket.id);
    socket.broadcast.emit("left", room, socket.id);
  });

  socket.on("message", (room, data) => {
    io.in(room).emit("message", room, socket.id, data);
  });
});
https_server.listen(443, "0.0.0.0");
