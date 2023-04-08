const socket = io();

const downButton = document.getElementById("down");

downButton.onclick = () => {
  socket.emit("down");
};

const upButton = document.getElementById("up");

upButton.onclick = () => {
  socket.emit("up");
};
