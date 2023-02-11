const Chat = require("../models/Chat");
const User = require("../models/User");

module.exports = {
  async create(req, res) {
    const { id } = req.params;
    const { title, about } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(500).json({
        error:
          "It's not possible create chat without a creator, user not found!",
        status: 500,
      });
    }

    const chat = await Chat.create({
      title,
      about,
      user_id: parseInt(id),
    });

    await user.addChat(chat);

    return res.json(chat);
  },

  async index(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: {
        association: "chats",
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(500).json({
        error:
          "It's not possible create chat without a creator, user not found!",
        status: 500,
      });
    }

    if (!user.chats || !user.chats.length) {
      return res
        .status(500)
        .json({ error: "This user not have chats yet.", status: 500 });
    }

    return res.json(user.chats);
  },

  async delete(req, res) {
    const { chat_id } = req.params;

    const chat = await Chat.findByPk(chat_id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    await Chat.destroy({
      where: {
        id: chat_id,
      },
    });

    return res.json(chat);
  },

  async putUser(req, res) {
    const { id, user_id } = req.params;
    const { email, password } = req.body;

    const chat = await Chat.findByPk(id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    const chat_creator = await Chat.findByPk(id, {
      include: {
        association: "chat_creator",
      },
    });

    if (!chat_creator.chat_creator) {
      return res.status(500).json({
        error: "It's not possible put user in a chat without a creator!",
        status: 500,
      });
    }

    if (
      chat_creator.chat_creator.email == email &&
      chat_creator.chat_creator.password == password
    ) {
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          error: "User not found!",
          status: 404,
        });
      }

      await chat.addUser(user);

      return res.json(user);
    } else {
      return res.status(500).json({ error: "User not creator!", status: 500 });
    }
  },

  async allIndex(req, res) {
    const chats = await Chat.findAll();

    if (!chats || !chats.length) {
      return res.status(404).json({ error: "Chats not found!", status: 404 });
    }

    return res.json(chats);
  },

  async userIndex(req, res) {
    const { id } = req.params;

    const chat = await Chat.findByPk(id, {
      include: {
        association: "users",
        through: {
          attributes: [],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    return res.json(chat.users);
  },

  async removeUser(req, res) {
    const { id, user_id } = req.params;

    const chat = await Chat.findByPk(id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    const chat_creator = await Chat.findByPk(id, {
      include: {
        association: "chat_creator",
      },
    });

    if (!chat_creator.chat_creator){
      return res.status(500).json({
        error: "It's not possible remove user from chat without a creator!",
        status: 500,
      });
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
        status: 404,
      });
    }

    await chat.removeUser(user);

    const newChat = await Chat.findByPk(id, {
      include: {
        association: "users",
      },
    });

    if (!newChat.users.length || !newChat.users)
      await Chat.destroy({ where: { id } });

    return res.json(user);
  },
  async update(req, res) {
    const { id } = req.params;
    const { title, about, email, password } = req.body;

    const chat = await Chat.findByPk(id);

    const chat_creator = await Chat.findByPk(id, {
      include: {
        association: "chat_creator",
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    if (!chat_creator.chat_creator){
      return res.status(500).json({
        error:
          "It's not possible update chat without a creator, user not found!",
        status: 500,
      });
    }

    if (
      chat_creator.chat_creator.email == email &&
      chat_creator.chat_creator.password == password
    ) {
      await chat.update({
        title,
        about,
      });

      return res.json(chat);
    } else {
      return res.status(500).json({ error: "User not creator!", status: 500 });
    }
  },
};
