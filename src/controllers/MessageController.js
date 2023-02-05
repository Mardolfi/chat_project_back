const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

module.exports = {
  async allIndex(req, res) {
    const messages = await Message.findAll();
    return res.json(messages);
  },
  async create(req, res) {
    const { chat_id, user_id } = req.params;
    const { body } = req.body;

    const chat = await Chat.findByPk(chat_id);

    const message_creator = await Chat.findByPk(chat_id, {
      include: {
        association: "users",
        where: {
          id: user_id,
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    if (!message_creator) {
      return res.status(404).json({ error: "User not found!", status: 404 });
    }

    const message = await Message.create({
      user_id: parseInt(user_id),
      chat_id: parseInt(chat_id),
      body,
    });

    return res.json(message);
  },
  async userIndex(req, res) {
    const { chat_id, user_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: {
        association: "user_messages",
        where: {
          chat_id,
        },
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found!",
        status: 404,
      });
      return;
    }

    if (!user.user_messages || !user.user_messages.length) {
      return res.status(500).json({
        error: "This user not have messages on this chat yet.",
        status: 500,
      });
    }

    const chat = await Chat.findByPk(chat_id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    return res.json(user.user_messages);
  },
  async chatIndex(req, res) {
    const { id } = req.params;

    const chat = await Chat.findByPk(id, {
      include: {
        association: "chat_messages",
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    if (!chat.chat_messages) {
      return res
        .status(500)
        .json({ error: "This chat not have messages yet.", status: 500 });
    }

    return res.json(chat.chat_messages);
  },
  async oneIndex(req, res) {
    const { id, message_id } = req.params;

    const chat = await Chat.findByPk(id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    const message = await Message.findByPk(message_id);

    if (!message) {
      return res.status(404).json({ error: "Message not found!", status: 404 });
    }

    return res.json(message);
  },
};
