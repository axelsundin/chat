//socket connection to default host
const socket = io();
let submitBtn = document.getElementById("submitBtn");
//global variables
const messages = document.getElementById("messages");
const inputArea = document.getElementById("inputArea");
let gifDiv = null;
const form = document.getElementById("form");
const input = document.getElementById("input");

let userName;
let typing = false;
//forces user to choose name when app starts, and emits it to server
window.onload = () => {
  do {
    userName = prompt("Enter your name:");
  } while (userName == null || userName == "");
  socket.emit("user connected", userName);
};

//emits input when submit-button is triggered, unless input is empty
//if input starts with "/" -->
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let msg = input.value;

  if (!msg.startsWith("/")) {
    socket.emit("chat message", { userName, msg });
  }
  input.value = "";
});

//adds <li> "[username]: [chat message]" in chat
//removes <li> "[username] is typing..." if there is one
socket.on("chat message", (msg) => {
  if (msg.url) {
    if (msg.userName !== userName) {
      typingLi = document.getElementById(msg.userName);
      messages.removeChild(typingLi);
    }
    const item = document.createElement("li");
    const text = document.createElement("p");
    const img = document.createElement("img");
    item.style.display = "flex";
    text.style.margin = "0 5px 0 0";
    text.innerHTML = msg.userName + ": ";
    img.src = msg.url;
    messages.appendChild(item);
    item.appendChild(text);
    item.appendChild(img);
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    if (msg.userName !== userName) {
      typingLi = document.getElementById(msg.userName);
      messages.removeChild(typingLi);
    }
    const item = document.createElement("li");
    item.textContent = msg.userName + ": " + msg.msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
  typing = false;
});

//if user types, emit to server
input.addEventListener("input", function (e) {
  e.preventDefault();
  let msg = input.value;
  if (msg.startsWith("/")) {
    collectText(msg);
  } else if (msg === "") {
    if (gifDiv === null) {
    } else {
      inputArea.removeChild(gifDiv);
    }
  }
  if (!typing) {
    typing = true;
    msg = userName + " is typing...";
    socket.emit("typing", { userName, msg, typing });
  }
});

//adds <li> "[username] is typing..." in chat
//if element with id "typing" does not exist, create one
//prevents multiple "[username] is typing..." since it is triggered on input
socket.on("typing", function (msg) {
  if (msg.userName !== userName) {
    const item = document.createElement("li");
    item.id = msg.userName;
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

async function collectText(msg) {
  console.log("collectText run");
  const textToDisplay = await makeRequest(
    "http://api.giphy.com/v1/gifs/trending?api_key=hXZ9UKHaXXv9rxb3kMfISfbwuyu4ydTJ&limit=25&rating=g",
    "GET"
  );

  if (gifDiv === null) {
    gifDiv = document.createElement("div");
    gifDiv.id = "gifDiv";
  }
  inputArea.appendChild(gifDiv);

  if (msg === "") {
    inputArea.removeChild(gifDiv);
  } else if (msg.startsWith("/")) {
    const text = document.createElement("p");
    text.id = "trending";
    text.innerHTML = "/trending";

    submitBtn.addEventListener("click", () => {
      gifDiv.remove();
    });

    if (gifDiv.hasChildNodes() === true) {
      clearElementChild("gifDiv");
    }
    gifDiv.appendChild(text);

    if (msg === "/trending") {
      textToDisplay.data.map((e) => {
        const imgContainer = document.createElement("img");
        imgContainer.style.height = "50px";
        imgContainer.style.width = "50px";
        let url = e.images.downsized.url;
        imgContainer.src = url;

        imgContainer.addEventListener("click", () => {
          socket.emit("chat message", { url, userName });
          gifDiv.remove();
          input.value = "";
        });

        gifDiv.appendChild(imgContainer);

        window.scrollTo(0, document.body.scrollHeight);
      });
    }
  }
}

async function makeRequest(url, method, body) {
  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
    });

    const result = await response.json();

    return result;
  } catch (err) {
    console.error(err);
  }
}

//clears element
function clearElementChild(element) {
  let elementToClear = document.getElementById(element);
  let child = elementToClear.lastElementChild;
  while (child) {
    elementToClear.removeChild(child);
    child = elementToClear.lastElementChild;
  }
}
