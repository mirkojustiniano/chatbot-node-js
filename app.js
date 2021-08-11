const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const io = socket(server);

io.on("connection", socket => {
  console.log('connected...');
  socket.emit("message", "Greetings!");

  socket.on("message", (data) => {
    console.log('message...');
    console.log(data);
    socket.emit("message", data);
  });

  socket.on("disconnect", (reason) => {
    console.log('disconnect...');
    console.log(reason);
  });
});