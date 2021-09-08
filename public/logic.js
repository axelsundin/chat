

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
form.addEventListener("submit",function (e) {
  e.preventDefault();
  msg = input.value;
  
  if (msg) {
    if (msg.startsWith("/")) {
      collectText(msg)
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

async function collectText(){
  const textToDisplay = await makeRequest("http://localhost:3000/api", "GET")
  
 
  if(msg =="/"){
    
  
    for (let index = 0; index < textToDisplay.length; index++) {
      const commandList = textToDisplay[index];
    
    const item = document.createElement("li");
    item.id = "typing";
    item.innerHTML = "Aviable Commands:" + " " + "/" + commandList.commands
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
    console.log(textToDisplay)

  } else if (msg == "/dog"){
    
  
    const item = document.createElement("img");
    item.id = "typing";
    item.src = textToDisplay[0].image
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  
    console.log(textToDisplay[0].image)

  } else if (msg == "/cat"){
    console.log(textToDisplay[1].image)
  }


}


async function makeRequest(url, method, headers, body){
  try {
    const response = await fetch(url, {
      headers,
      method,
      body: JSON.stringify(body),
    })
    
    console.log(response)
    const result = await response.json()
    
    
    return result

  }catch (err) {
    console.error(err)
  }

}