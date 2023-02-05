const { Model, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {promisify} = require("util");

class Attachment extends Model {
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
          beforeDestroy(attachment) {
            return promisify(fs.unlink)(
              path.resolve(__dirname, "..", "..", "tmp", "uploads", attachment.key)
            );
          },
        },
        sequelize: connection,
        tableName: "attachment",
        modelName: "attachment",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.message, { foreignKey: "message_id", as: "message" });
  }
}

module.exports = Attachment;
