const { Model, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {promisify} = require("util");

class ChatImage extends Model {
  static init(connection) {
    super.init(
      {
        size: DataTypes.INTEGER,
        name: DataTypes.STRING,
        key: DataTypes.TEXT,
        url: DataTypes.TEXT,
      },
      {
        hooks: {
          beforeDestroy(chat_image) {
            return promisify(fs.unlink)(
              path.resolve(__dirname, "..", "..", "tmp", "uploads", chat_image.key)
            );
          },
        },
        sequelize: connection,
        tableName: "chat_image",
        modelName: "chat_image",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.chat, { foreignKey: "chat_id", as: "chat" });
  }
}

module.exports = ChatImage;
