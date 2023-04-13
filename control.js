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
