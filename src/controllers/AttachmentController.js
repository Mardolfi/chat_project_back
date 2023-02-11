const Attachment = require("../models/Attachment");
const Message = require("../models/Message");

module.exports = {
  async create(req, res) {
    const { id } = req.params;

    const message = await Message.findByPk(id, {
      include: {
        association: 'attachment'
      }
    });

    if (!message) {
      res.status(404).json({ error: "Message not found!", status: 404 });
      return;
    }

    const { key, originalname: name, size, location: url } = req.file;

    const file = {
      name,
      key,
      size,
      url,
      message_id: parseInt(id),
    };

    if(!message.attachment) {
      const attachment = await Attachment.create({
        name : file.name,
        key : file.key,
        size : file.size,
        url : file.url,
        message_id : file.message_id,
      });
  
      return res.json(attachment);
    } else {
      await Attachment.destroy({
        where: {
          message_id: id,
        }
      })

      const attachment = await Attachment.create({
        name : file.name,
        key : file.key,
        size : file.size,
        url : file.url,
        message_id : file.message_id,
      });
  
      return res.json(attachment);
    }
  },

  async index(req, res) {
    const { id } = req.params;

    const message = await Message.findByPk(id, {
      include: {
        association: "attachment",
      },
    });

    if (!message) {
      res.status(404).json({ error: "Message not found!", status: 404 });
      return;
    }

    if(!message.attachment) {
      res.status(500).json({error: 'This message not have attachments yet.', status: 500})
      return;
    }

    return res.json(message.attachment);
  },
};
