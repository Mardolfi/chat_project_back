const { Model, DataTypes } = require("sequelize");

class Message extends Model {
  static init(connection) {
    super.init(
      {
        body: DataTypes.TEXT,
      },
      {
        sequelize: connection,
        tableName: "message",
        modelName: "message",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.user, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.chat, { foreignKey: "chat_id", as: "chat" });
    this.hasMany(models.attachment, {
      foreignKey: "message_id",
      as: "attachment",
    });
  }
}

module.exports = Message;
