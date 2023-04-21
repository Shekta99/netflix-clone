const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");

app.use("/", express.static(path.join(__dirname, "www")));
app.use("/", express.static(path.join(__dirname, "public")));

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

  socket.on("ACC_DATA", (data) => {
    socket.broadcast.emit("ACC_DATA", data);
  });

  socket.on("like_video", () => {
    socket.broadcast.emit("like_video");
  });

  socket.on("previous_video", () => {
    socket.broadcast.emit("previous_video");
  });

  socket.on("next_video", () => {
    socket.broadcast.emit("next_video");
  });

  socket.on("select", () => {
    socket.broadcast.emit("select");
  });

  socket.on("search", (data) => {
    socket.broadcast.emit("search", data);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
