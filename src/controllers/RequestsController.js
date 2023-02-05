const Requests = require("../models/Requests");
const User = require("../models/User");

module.exports = {
  async create(req, res) {
    const { id, user_id } = req.params;
    const { is_accepted, is_rejected } = req.body;

    const isHasRequest = await Requests.findAll({
      where: {
        sender_id: parseInt(id),
        recipient_id: parseInt(user_id),
      }
    })

    if(isHasRequest.length > 0){
      return res.status(501).json({
        error: 'This request already exists!'
      })
    } else {
      const request = await Requests.create({
        is_accepted,
        is_rejected,
        sender_id: parseInt(id),
        recipient_id: parseInt(user_id),
      });
  
      return res.json(request);
    }
  },
  async delete(req, res) {
    const {id} = req.params;

    const request = await Requests.findByPk(id)

    if(!request){
      return res.status(404).json({
        error: 'Request not found!'
      })
    }

    await request.destroy()

    return res.json(request)
  },
  async senderIndex(req, res) {
    const { id } = req.params;

    const request = await Requests.findByPk(id, {
      include: {
        association: "request_sender",
      },
    });

    if (!request) {
      return res.status(500).json({
        error: "Not found!",
      });
    }

    return res.json(request.request_sender);
  },
  async recipientIndex(req, res) {
    const { id } = req.params;

    const request = await Requests.findByPk(id, {
      include: {
        association: "request_recipient",
      },
    });

    if (!request) {
      return res.status(500).json({
        error: "Not found!",
      });
    }

    return res.json(request.request_recipient);
  },
  async userSender(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: {
        association: "user_requests",
      },
    });

    if (!user) {
      return res.status(500).json({
        error: "Not found!",
      });
    }

    return res.json(user.user_requests);
  },
  async userRecipient(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: {
        association: "requests_users",
      },
    });

    if (!user) {
      return res.status(500).json({
        error: "Not found!",
      });
    }

    return res.json(user.requests_users);
  },
  async update(req, res) {
    const { id } = req.params;

    const request = await Requests.findByPk(id);

    if (!request) {
      return res.status(500).json({
        error: "Not found!",
      });
    }

    request.update(req.body);

    return res.json(request);
  },
};
