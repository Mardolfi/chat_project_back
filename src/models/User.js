const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(connection) {
    super.init(
      {
        first_name: DataTypes.STRING(100),
        last_name: DataTypes.STRING(100),
        email: DataTypes.STRING,
        password: DataTypes.STRING(32),
        is_online: DataTypes.BOOLEAN,
      },
      {
        sequelize: connection,
        tableName: "user",
        modelName: "user",
      }
    );
  }

  static associate(models) {
    this.hasOne(models.profile_image, {
      foreignKey: "user_id",
      as: "profile_image",
    });
    this.belongsToMany(models.chat, {
      foreignKey: "user_id",
      through: "user_chats",
      as: "chats",
    });
    this.hasMany(models.chat, {
      foreignKey: "user_id",
      as: "chats_created",
    });
    this.hasMany(models.message, {
      foreignKey: "user_id",
      as: "user_messages",
    });
    this.hasMany(models.request, {
      foreignKey: "sender_id",
      as: "user_requests",
    });
    this.hasMany(models.request, {
      foreignKey: "recipient_id",
      as: "requests_users",
    });
    this.belongsToMany(models.user, {
      foreignKey: "user_id",
      through: "user_friends",
      as: "friend",
    });
    this.belongsToMany(models.user, {
      foreignKey: "friend_id",
      through: "user_friends",
      as: "friends",
    })
  }
}

module.exports = User;
