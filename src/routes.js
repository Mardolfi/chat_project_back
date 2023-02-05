const routes = require("express").Router();
const UserController = require("./controllers/UserController");
const multer = require("multer");
const multerConfig = require("./config/multer");
const ProfileImageController = require("./controllers/ProfileImageController");
const ChatImageController = require("./controllers/ChatImageController");
const AttachmentController = require("./controllers/AttachmentController");
const ChatController = require("./controllers/ChatController");
const MessageController = require("./controllers/MessageController");
const RequestsController = require("./controllers/RequestsController");

routes.post("/users", UserController.create);
routes.get("/users", UserController.index);
routes.get("/users/login", UserController.login);
routes.get("/users/:id", UserController.one);
routes.delete("/users/:id", UserController.delete);
routes.patch("/users/:id", UserController.update);
routes.get("/finduser/name", UserController.nameIndex);
routes.post("/users/:id/addfriend/:user_id", UserController.friendCreate)
routes.get("/users/:id/friendsadded", UserController.friendIndex)
routes.get("/users/:id/addedfriends", UserController.indexFriend)
routes.delete("/users/:id/friends/:user_id", UserController.removeFriend)

routes.get("/users/:id/image", ProfileImageController.index);
routes.post(
  "/users/:id/image",
  multer(multerConfig).single("file"),
  ProfileImageController.create
);
routes.delete("/users/:id/image", ProfileImageController.delete);

routes.get("/chats/:id/image", ChatImageController.index);
routes.post(
  "/chats/:id/image",
  multer(multerConfig).single("file"),
  ChatImageController.create
);
routes.delete("/chats/:id/image", ChatImageController.delete);

routes.post("/users/:id/chat", ChatController.create);
routes.post("/chats/:id/users/:user_id", ChatController.putUser);
routes.get("/chats", ChatController.allIndex);
routes.get("/users/:id/chat", ChatController.index);
routes.get("/chats/:id/users", ChatController.userIndex);
routes.delete("/chats/:chat_id", ChatController.delete);
routes.delete("/chats/:id/users/:user_id", ChatController.removeUser);
routes.patch("/chats/:id", ChatController.update);

routes.post(
  "/users/:user_id/chats/:chat_id/messages",
  MessageController.create
);
routes.get(
  "/users/:user_id/chats/:chat_id/messages",
  MessageController.userIndex
);
routes.get("/chats/:id/messages", MessageController.chatIndex);
routes.get("/chats/:id/messages/:message_id", MessageController.oneIndex);
routes.get("/messages", MessageController.allIndex);

routes.get("/messages/:id/attachments", AttachmentController.index);
routes.post(
  "/messages/:id/attachments",
  multer(multerConfig).single("file"),
  AttachmentController.create
);

routes.post("/users/:id/friends/:user_id", RequestsController.create);
routes.get("/requests/:id/sender", RequestsController.senderIndex);
routes.get("/requests/:id/recipient", RequestsController.recipientIndex);
routes.get("/users/:id/requests/sender", RequestsController.userSender);
routes.get("/users/:id/requests/recipient", RequestsController.userRecipient);
routes.patch("/requests/:id", RequestsController.update)
routes.delete("/requests/:id", RequestsController.delete)

module.exports = routes;
