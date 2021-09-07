const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.broadcast.emit("user connected", "a new user has connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("typing", (msg) => {
    socket.broadcast.emit("typing", msg);
  });
});

http.listen(port, () => console.log("server running on port: " + port));
