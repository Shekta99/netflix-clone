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

  socket.on("home", () => {
    socket.broadcast.emit("home");
  });

  socket.on("tvshow", () => {
    socket.broadcast.emit("tvshow");
  });

  socket.on("movies", () => {
    socket.broadcast.emit("movies");
  });

  socket.on("originals", () => {
    socket.broadcast.emit("originals");
  });

  socket.on("play", () => {
    socket.broadcast.emit("play");
  });

  socket.on("pause", () => {
    socket.broadcast.emit("pause");
  });

  socket.on("subir_volume", () => {
    socket.broadcast.emit("subir_volume");
  });

  socket.on("bajar_volume", () => {
    socket.broadcast.emit("bajar_volume");
  });

  socket.on("mutear_volume", () => {
    socket.broadcast.emit("mutear_volume");
  });

  socket.on("adelantar_video", () => {
    socket.broadcast.emit("adelantar_video");
  });
  socket.on("retrasar_video", () => {
    socket.broadcast.emit("retrasar_video");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
