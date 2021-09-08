const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

let clients = [];

let commandsList = [
  {
    commands: "dog",
    image: "public/assets/dog.png"

  },{
    
    commands: "cat",
    image: "public/assets/cat.png"
  }
]

app.use(express.static("public"));

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

app.get("/api" , (req, res) => {
  res.json(commandsList)


})

http.listen(port, () => console.log("server running on port: " + port));
