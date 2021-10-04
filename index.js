const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

app.use(express.static("public"));

let clients = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("user connected", (userName) => {
    if (!clients.some((obj) => obj.id === socket.id)) {
      clients.push({ id: socket.id, userName: userName });
    }
    socket.broadcast.emit("user connected", userName);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    const id = clients
      .map(function (e) {
        return e.id;
      })
      .indexOf(socket.id);
    socket.broadcast.emit("user disconnected", clients[id].userName);
    clients.splice(id, 1);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("typing", (msg) => {
    io.emit("typing", msg);
  });
});

http.listen(port, () => console.log("server running on port: " + port));
