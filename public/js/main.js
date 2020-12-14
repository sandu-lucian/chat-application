const socket = io();

document
  .getElementById("join-chat-btn")
  .addEventListener("click", function (e) {
    const input = document.getElementById("username-input");
    const userName = input.value;

    if (userName.length > 0) {
      document.getElementById("username-missing").classList.add("invisible");
      socket.emit("join-chat", userName);
    } else {
      document.getElementById("username-missing").classList.remove("invisible");
    }
  });

socket.on("joined-chat", function (userName, userCounter) {
  document.getElementById("join-chat").classList.add("d-none");
  document.getElementById("chat-container").classList.remove("d-none");
  const messageContainer = document.getElementById("chat-messages");
  const userElement = document.createElement("p");
  userElement.innerHTML = userName;
  messageContainer.appendChild(userElement);

  const userCountSpan = document.getElementById("online-users-count");
  userCountSpan.innerHTML = userCounter;
});

document
  .getElementById("send-message-btn")
  .addEventListener("click", function () {
    const msgInput = document.getElementById("message");
    const message = msgInput.value;
    const colorInput = document.getElementById("msg-color");
    const msgColor = colorInput.value;
    socket.emit("send-message", message, msgColor);
    msgInput.value = "";
  });

socket.on("new-message", function (message) {
  const messageContainer = document.getElementById("chat-messages");
  const messageElement = document.createElement("p");
  messageElement.innerHTML = message;
  messageContainer.appendChild(messageElement);
});

document
  .getElementById("leave-chat-btn")
  .addEventListener("click", function () {
    socket.emit("leave-chat");
  });

socket.on("left-chat", function (message, userCounter) {
  const leaveMessageContainer = document.getElementById("chat-messages");
  const leaveMessageElement = document.createElement("p");
  leaveMessageElement.innerHTML = message;
  leaveMessageContainer.appendChild(leaveMessageElement);

  const userCountSpan = document.getElementById("online-users-count");
  userCountSpan.innerHTML = userCounter;
});

socket.on("menu", function () {
  document.getElementById("join-chat").classList.remove("d-none");
  document.getElementById("chat-container").classList.add("d-none");
});
