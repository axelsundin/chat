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
    clients.push({ id: socket, userName: userName });
    socket.broadcast.emit("user connected", userName);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    const id = clients
      .map(function (e) {
        return e.id;
      })
      .indexOf(socket);
    socket.broadcast.emit("user disconnected", clients[id].userName);
    clients.splice(id, 1);
  });

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("typing", (msg) => {
    socket.broadcast.emit("typing", msg);
  });
});



http.listen(port, () => console.log("server running on port: " + port));
