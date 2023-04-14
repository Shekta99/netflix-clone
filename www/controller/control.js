const socket = io();

const downButton = document.getElementById("down");

downButton.onclick = () => {
  socket.emit("down");
};

const upButton = document.getElementById("up");

upButton.onclick = () => {
  socket.emit("up");
};

const logo = document.getElementById("logo");

logo.onclick = () => {
  socket.emit("home");
};

const home = document.getElementById("home-link");

home.onclick = () => {
  socket.emit("home");
};

const tvshow = document.getElementById("tvshow");

tvshow.onclick = () => {
  socket.emit("tvshow");
};

const movies = document.getElementById("movies");

movies.onclick = () => {
  socket.emit("movies");
};

const originals = document.getElementById("originals");

originals.onclick = () => {
  socket.emit("originals");
};

const play = document.getElementById("play");

play.onclick = () => {
  socket.emit("play");
};

const pause = document.getElementById("pause");

pause.onclick = () => {
  socket.emit("pause");
};

const subirVolume = document.getElementById("subir_volume");

subirVolume.onclick = () => {
  socket.emit("subir_volume");
};

const bajarVolume = document.getElementById("bajar_volume");

bajarVolume.onclick = () => {
  socket.emit("bajar_volume");
};

const mutearVolume = document.getElementById("mutear_volume");

mutearVolume.onclick = () => {
  socket.emit("mutear_volume");
};

const adelantarVideo = document.getElementById("adelantar_video");

adelantarVideo.onclick = () => {
  socket.emit("adelantar_video");
};

const retrasarVideo = document.getElementById("retrasar_video");

retrasarVideo.onclick = () => {
  socket.emit("retrasar_video");
};
