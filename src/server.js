require('dotenv').config()

const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const path = require("path");
const cors = require("cors");

require("./database");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
app.use(morgan("dev"));
app.use(routes);

const User = require("./models/User");

const users = [];

io.on("connection", (socket) => {
  socket.on("userConnected", async (id) => {
    const newUser = await User.findByPk(id);
    newUser.update({ is_online: true });

    socket.emit("userConnecting", newUser);
    socket.broadcast.emit("userConnecting", newUser);

    const user = {
      user: id,
      socket: socket.id,
    };

    users.push(user);
  });

  socket.on("userSendAAttachment", (attachment, messageId) => {
    socket.broadcast.emit("userSendingAMessage", attachment, messageId)
  })

  socket.on("userSendAMessage", (userId, chatId, message) => {
    socket.broadcast.emit("userSendingAMessage", userId, chatId, message)
  })

  socket.on("addUserInAChat", (id, activeChat) => {
    socket.broadcast.emit('userAddingAnotherUserInAChat', id, activeChat)
  })

  socket.on("removeUserInAChat", (id, activeChat) => {
    socket.broadcast.emit('userRemovingAnotherUserInAChat', id, activeChat)
  })

  socket.on("userRemoveRequest", (request) => {
    socket.broadcast.emit("requestRemoved", request)
  })

  socket.on('requestEdited', (request) => {
    socket.broadcast.emit("requestHasEdited", request)
  })

  socket.on('userRemoveFriend', (user) => {
    socket.broadcast.emit('removedByUser', user)  
  })

  socket.on("userAddFriend", (userAddedId, userAddingId) => {
    socket.broadcast.emit("addedByUser", userAddedId, userAddingId)
  })

  socket.on("newRequest", (request) => {
    socket.broadcast.emit("userNewRequest", request)
  })

  socket.on("disconnect", async () => {
    const userDisconnecting = users.find((user) => user.socket == socket.id);

    if (userDisconnecting) {
      const newUser = await User.findByPk(userDisconnecting.user);
      newUser.update({ is_online: false });

      socket.broadcast.emit("userDisconnecting", newUser);
    }
  });
});

server.listen(process.env.PORT || 3333, () => console.log(`Server in running on ${process.env.PORT || 3333}`));
