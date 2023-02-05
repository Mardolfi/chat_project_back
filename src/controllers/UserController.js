const User = require("../models/User");
const { Op } = require("sequelize");

module.exports = {
  async create(req, res) {
    const users = await User.findAll({
      where: {
        email: req.body.email,
      }
    })

    if(!users.length) {
      const user = await User.create(req.body)
      return res.json(user)
    } else {
      return res.status(401).json({
        error: 'This user already exists!'
      })
    }
  },
  async removeFriend(req, res){
    const {id, user_id} = req.params

    const user = await User.findByPk(id)

    if(!user) {
      return res.status(500).json({
        error: "This user doesn't exists!"
      })
    }

    const friend = await User.findByPk(user_id)

    if(!friend) {
      return res.status(404).json({
        error: "User not found!"
      })
    }

    user.removeFriend(friend)

    return res.json(friend)
  },
  async friendCreate(req, res){
    const {id, user_id} = req.params

    const user = await User.findByPk(id)

    if(!user) {
      return res.status(500).json({
        error: "This user doesn't exists!"
      })
    }

    const friend = await User.findByPk(user_id)

    if(!friend) {
      return res.status(404).json({
        error: "User not found!"
      })
    }

    user.addFriend(friend)

    return res.json(friend)
  },
  async friendIndex(req, res) {
    const {id} = req.params

    const user = await User.findByPk(id, {
      include: {
        association: 'friend',
        through: {
          attributes: [],
        }
      }
    })

    if(!user) {
      return res.status(500).json({
        error: "This user doesn't exists!"
      })
    }

    return res.json(user.friend)
  },
  async indexFriend(req, res){
    const {id} = req.params

    const user = await User.findByPk(id, {
      include: {
        association: 'friends',
        through: {
          attributes: [],
        }
      }
    })

    if(!user) {
      return res.status(500).json({
        error: "This user doesn't exists!"
      })
    }

    return res.json(user.friends)
  },
  async index(req, res) {
    const users = await User.findAll();

    if (!users.length || !users) {
      res.status(404).json({ error: "Not have users yet!", status: 404 });
      return;
    }

    return res.json(users);
  },
  async one(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not found!", status: 404 });
      return;
    }

    return res.json(user);
  },

  async login(req, res) {
    const { email, password } = req.query;

    const user = await User.findOne({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found!", status: 404 });
      return;
    }

    return res.json(user);
  },

  async nameIndex(req, res) {
    if (!req.query.lastname) {
      const users = await User.findAll({
        where: {
          first_name: {
            [Op.like]: `%${req.query.firstname}%`,
          },
        },
      });

      if (!users) {
        return res.status(500).json({
          error: "Not found users!",
        });
      }

      return res.json(users);
    } else {
      const users = await User.findAll({
        where: {
          first_name: {
            [Op.like]: `%${req.query.firstname}%`,
          },
          last_name: {
            [Op.like]: `%${req.query.lastname}%`,
          },
        },
      });

      if (!users) {
        return res.status(500).json({
          error: "Not found users!",
        });
      }

      return res.json(users);
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    const { email, password } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "User not found!", status: 404 });
      return;
    }

    if (user.email == email && user.password == password) {
      await user.destroy();
      return res.json(user);
    } else {
      return res.status(500).json({ error: "User not creator", status: 500 });
    }
  },
  async update(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "User not found!", status: 404 });
      return;
    }

    await user.update(req.body);
    return res.json(user);
  },
};
