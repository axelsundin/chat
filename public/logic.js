const socket = io();

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

let userName;

window.onload = () => {
  userName = prompt("Enter your name?");
};

input.addEventListener("input", function (e) {
  e.preventDefault();
  msg = userName + " is typing...";
  socket.emit("typing", { msg });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  msg = input.value;
  if (msg) {
    if (msg.startsWith("/")) {
      console.log("commands");
    } else {
      socket.emit("chat message", { userName, msg });
      var item = document.createElement("li");
      item.textContent = userName + ": " + msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
  input.value = "";
});

socket.on("typing", function (msg) {
  const typing = document.getElementById("typing");
  if (!typing) {
    const item = document.createElement("li");
    item.id = "typing";
    item.textContent = msg.msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});

socket.on("chat message", function (msg) {
  const typing = document.getElementById("typing");
  messages.removeChild(typing);

  const item = document.createElement("li");
  item.textContent = msg.userName + ": " + msg.msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("user connected", function (msg) {
  const typing = document.getElementById("typing");
  if (typing) {
    messages.removeChild(typing);
  }
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
