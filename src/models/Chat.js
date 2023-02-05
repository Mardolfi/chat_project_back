const { Model, DataTypes } = require("sequelize");

class Chat extends Model {
  static init(connection) {
    super.init(
      {
        title: DataTypes.STRING,
        about: DataTypes.TEXT,
      },
      {
        sequelize: connection,
        tableName: "chat",
        modelName: "chat",
      }
    );
  }

  static associate(models) {
    this.hasOne(models.chat_image, {
      foreignKey: "chat_id",
      as: "chat_image",
    });
    this.belongsToMany(models.user, {
      foreignKey: 'chat_id',
      through: "user_chats",
      as: "users",
    });
    this.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'chat_creator'
    })
    this.hasMany(models.message, {
      foreignKey: "chat_id",
      as: "chat_messages",
    });
  }
}

module.exports = Chat;
