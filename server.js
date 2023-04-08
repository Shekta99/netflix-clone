const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/style.css");
});

app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/mobile.html", function (req, res) {
  res.sendFile(__dirname + "/mobile.html");
});

app.get("/script.js", function (req, res) {
  res.sendFile(__dirname + "/script.js");
});

app.get("/control.js", function (req, res) {
  res.sendFile(__dirname + "/control.js");
});

app.get("/web.js", function (req, res) {
  res.sendFile(__dirname + "/web.js");
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("down", () => {
    socket.broadcast.emit("down");
  });
  socket.on("up", () => {
    socket.broadcast.emit("up");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
