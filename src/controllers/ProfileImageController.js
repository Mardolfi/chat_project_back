const ProfileImage = require("../models/ProfileImage");
const User = require("../models/User");

module.exports = {
  async create(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: {
        association: "profile_image",
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
        status: 404,
      });
    }

    const { key, originalname: name, size, location: url } = req.file;

    const file = {
      name,
      key,
      size,
      url,
      user_id: parseInt(id),
    };

    if (!user.profile_image) {
      const profile_image = await ProfileImage.create({
        name: file.name,
        key: file.key,
        size: file.size,
        url: file.url,
        user_id: file.user_id,
      });

      return res.json(profile_image);
    } else {
      await ProfileImage.destroy({
        where: {
          user_id: id,
        },
      });

      const profile_image = await ProfileImage.create({
        name: file.name,
        key: file.key,
        size: file.size,
        url: file.url,
        user_id: file.user_id,
      });

      return res.json(profile_image);
    }
  },

  async index(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: {
        association: "profile_image",
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
        status: 404,
      });
    }

    if (!user.profile_image) {
      return res
        .status(500)
        .json({ error: "This user not have profile images yet.", status: 500 });
    }

    return res.json(user.profile_image);
  },

  async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: {
        association: "profile_image",
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
        status: 404,
      });
    }

    if (!user.profile_image) {
      return res
        .status(500)
        .json({ error: "This user not have profile images yet.", status: 500 });
    }

    await user.profile_image.destroy();

    return res.json(user.profile_image);
  },
};
