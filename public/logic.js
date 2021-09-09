

//socket connection to default host
const socket = io();

//global variables
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
let userName;

//forces user to choose name when app starts, and emits it to server
/* window.onload = () => {
  userName = prompt("Enter your name?");
  socket.emit("user connected", userName);
}; */

//emits input when submit-button is triggered, unless input is empty
//if input starts with "/" -->
form.addEventListener("submit",function (e) {
  e.preventDefault();
  msg = input.value;
  
  socket.emit("chat message", { userName, msg });
    
  if (msg) {
    if (msg.startsWith("/")) {
      collectText()
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

  if(msg.url){
    const item = document.createElement("li");
 const img = document.createElement("img")
 img.src = msg.url
  messages.appendChild(item);
  iTextMetrics.appendChild(img)
  window.scrollTo(0, document.body.scrollHeight);
  } else {

    const item = document.createElement("li");
    item.textContent = msg.userName + ": " + msg.msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});

//if user types, emit to server
input.addEventListener("input", function (e) {
  e.preventDefault();
  msg = input.value;
  if (msg.startsWith("/")) {
      collectText(msg)
  } else {
    gifDiv = document.getElementById("gifDiv")
    messages.removeChild(gifDiv)
  }
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



async function collectText(msg){
  const textToDisplay = await makeRequest("https://api.giphy.com/v1/gifs/trending?api_key=hXZ9UKHaXXv9rxb3kMfISfbwuyu4ydTJ&limit=25&rating=g", "GET")
  
  const item = document.createElement("div");
  item.id = "gifDiv";
  messages.appendChild(item);
  
  if(msg == "/"){

    const text = document.createElement("p")
    text.innerHTML = "/trending"
    
    
    
    item.appendChild(text)
    
    


  } else if (msg == "/trending"){
    textToDisplay.data.map(e=>{
  
      
        const imgContainer = document.createElement("img")
        imgContainer.style.height = "50px"
        imgContainer.style.width = "50px"
        url = e.images.downsized.url
        imgContainer.src = url
        /* imgContainer.onclick(() => {
          socket.emit("chat message", { url: e.images.downsized.url })
        }) */
        imgContainer.addEventListener("click", ()=>{socket.emit("chat message", { url: url })})
        item.appendChild(imgContainer)
        window.scrollTo(0, document.body.scrollHeight);
      })

  }
 


  /* for (let index = 0; index < textToDisplay.length; index++) {
    const commandList = textToDisplay[index];
    console.log(commandList)


    const text = document.createElement("p")
    text.innerText = "/gif"
    const imgContainer = document.createElement("img")
    imgContainer.style.height = "100px"
    imgContainer.style.width = "100px"
    imgContainer.src = textToDisplay.data[index].images.downsized.url
    
    item.appendChild(text)
    item.appendChild(imgContainer)
    window.scrollTo(0, document.body.scrollHeight);
  
  } */
}


async function makeRequest(url, method, body){
  try {
    const response = await fetch(url, {
      
      method,
      body: JSON.stringify(body),
    })
    
    
    const result = await response.json()
    
    
    return result

  }catch (err) {
    console.error(err)
  }

}