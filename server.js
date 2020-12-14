const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

http.listen(process.env.PORT || 3000, () => {
  console.log(`[ SUCCESS ] Server started.`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const chatUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected -> " + socket.id);

  socket.on("join-chat", function (userName) {
    chatUsers[socket.id] = userName;
    socket.join("chat");
    io.to("chat").emit(
      "joined-chat",
      `${userName} has joined the chat!`,
      `${Object.keys(chatUsers).length} user(s) online!`
    );
  });

  socket.on("send-message", function (message, color) {
    io.to("chat").emit(
      "new-message",
      `${chatUsers[socket.id]}: <span style="color:${color}">${message}</span>`
    );
  });

  socket.on("leave-chat", function () {
    let user = chatUsers[socket.id];
    delete chatUsers[socket.id];
    io.to("chat").emit(
      "left-chat",
      `${user} has left the chat!`,
      `${Object.keys(chatUsers).length} user(s) online!`
    );
    socket.leave("chat");
    socket.emit("menu");
  });
});
