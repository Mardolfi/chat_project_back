const ChatImage = require("../models/ChatImage");
const Chat = require("../models/Chat");

module.exports = {
  async create(req, res) {
    const { id } = req.params;

    const chat = await Chat.findByPk(id, {
      include: {
        association: 'chat_image'
      }
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }

    const { filename: key, originalname: name, size } = req.file;

    const file = {
      name,
      key,
      size,
      url: `http://localhost:3333/files/${key}`,
      chat_id: parseInt(id),
    };

    if(!chat.chat_image) {
      const chat_image = await ChatImage.create({
        name : file.name,
        key : file.key,
        size : file.size,
        url : file.url,
        chat_id : file.chat_id,
      });
  
      return res.json(chat_image);
    } else {
      await ChatImage.destroy({
        where: {
          chat_id: id,
        }
      })

      const chat_image = await ChatImage.create({
        name : file.name,
        key : file.key,
        size : file.size,
        url : file.url,
        chat_id : file.chat_id,
      });
  
      return res.json(chat_image);
    }
  },

  async index(req, res) {
    const { id } = req.params;

    const chat = await Chat.findByPk(id, {
      include: {
        association: "chat_image",
      },
    });

    if(!chat) {
      return res.status(404).json({error: 'Chat not found!', status: 404})
    }
    if(!chat.chat_image) {
      return res.status(500).json({error: 'This chat not have chat images yet.', status: 500})
    }

    return res.json(chat.chat_image);
  },

  async delete(req, res) {
    const {id} = req.params

    const chat = await Chat.findByPk(id, {
      include: {
        association: 'chat_image'
      }
    })

    if(!chat) {
      return res.status(404).json({ error: "Chat not found!", status: 404 });
    }
    if(!chat.chat_image) {
      return res.status(500).json({error: 'This chat not have chat images yet.', status: 500})
    }

    await chat.chat_image.destroy();

    return res.json(chat.chat_image);
  }
};
