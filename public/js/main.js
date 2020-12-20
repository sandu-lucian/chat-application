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

socket.on("joined-chat", function (userName, userCounter, users) {
  document.getElementById("join-chat").classList.add("d-none");
  document.getElementById("chat-container").classList.remove("d-none");
  const messageContainer = document.getElementById("chat-messages");
  const userElement = document.createElement("span");
  userElement.classList.add(
    "bg-success",
    "text-center",
    "text-white",
    "rounded",
    "mb-1",
    "message-animation"
  );
  userElement.innerHTML = userName;
  messageContainer.appendChild(userElement);

  const userCountSpan = document.getElementById("online-users-count");
  userCountSpan.innerHTML = userCounter;

  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  for (const id in users) {
    const user = document.createElement("li");
    user.classList.add("list-group-item", "list-group-item-action");
    user.innerHTML = users[id];
    userList.appendChild(user);
  }

  const chat = document.getElementById("chat-messages");
  const chatHeight = chat.scrollHeight;
  chat.scrollTo(0, chatHeight);
});

document
  .getElementById("username-input")
  .addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      document.getElementById("join-chat-btn").click();
    }
  });

document.getElementById("message").addEventListener("keyup", function (e) {
  const messageInputValue = document.getElementById("message").value;
  if (messageInputValue && e.key === "Enter") {
    document.getElementById("send-message-btn").click();
  }
});

document
  .getElementById("send-message-btn")
  .addEventListener("click", function () {
    const msgInput = document.getElementById("message");
    const message = msgInput.value;
    const colorInput = document.getElementById("msg-color");
    const msgColor = colorInput.value;
    if (message) {
      socket.emit("send-message", message, msgColor);
    }
    msgInput.value = "";
  });

socket.on("new-message", function (message) {
  const messageContainer = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "card",
    "mb-1",
    "shadow-sm",
    "message-animation"
  );
  messageElement.innerHTML = `<div class="card-body py-2">${message}</div>`;
  messageContainer.appendChild(messageElement);

  const chat = document.getElementById("chat-messages");
  const chatHeight = chat.scrollHeight;
  chat.scrollTo(0, chatHeight);
});

document
  .getElementById("leave-chat-btn")
  .addEventListener("click", function () {
    socket.emit("leave-chat");
  });

socket.on("left-chat", function (message, userCounter, users) {
  const leaveMessageContainer = document.getElementById("chat-messages");
  const leaveMessageElement = document.createElement("span");
  leaveMessageElement.classList.add(
    "bg-warning",
    "text-center",
    "rounded",
    "mb-1",
    "message-animation"
  );
  leaveMessageElement.innerHTML = message;
  leaveMessageContainer.appendChild(leaveMessageElement);

  const userCountSpan = document.getElementById("online-users-count");
  userCountSpan.innerHTML = userCounter;

  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  for (const id in users) {
    const user = document.createElement("li");
    user.classList.add("list-group-item", "list-group-item-action");
    user.innerHTML = users[id];
    userList.appendChild(user);
  }

  const chat = document.getElementById("chat-messages");
  const chatHeight = chat.scrollHeight;
  chat.scrollTo(0, chatHeight);
});

socket.on("menu", function () {
  document.getElementById("join-chat").classList.remove("d-none");
  document.getElementById("chat-container").classList.add("d-none");
});

document.getElementById("modal-dismiss").addEventListener("click", function () {
  const colorInput = document.getElementById("msg-color");
  colorInput.value = "#000000";
});
