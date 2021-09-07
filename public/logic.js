//socket connection to default host
const socket = io();

//global variables
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
let userName;

//forces user to choose name when app starts, and emits it to server
window.onload = () => {
  userName = prompt("Enter your name?");
  socket.emit("user connected", userName);
};

//emits input when submit-button is triggered, unless input is empty
//if input starts with "/" -->
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

//adds <li> "[username]: [chat message]" in chat
//removes <li> "[username] is typing..." if there is one
socket.on("chat message", function (msg) {
  const typing = document.getElementById("typing");
  messages.removeChild(typing);

  const item = document.createElement("li");
  item.textContent = msg.userName + ": " + msg.msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

//if user types, emit to server
input.addEventListener("input", function (e) {
  e.preventDefault();
  msg = userName + " is typing...";
  socket.emit("typing", { msg });
});

//adds <li> "[username] is typing..." in chat
//if element with id "typing" does not exist, create one
//prevents multiple "[username] is typing..." since it is triggered on input
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

//adds <li> "[userName] has joined the chat" in chat
socket.on("user connected", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg + " has joined the chat";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

//adds <li> "[userName] has left the chat" in chat
socket.on("user disconnected", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg + " has left the chat";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
