const { Model, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {promisify} = require("util");

class ProfileImage extends Model {
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
          beforeDestroy(profile_image) {
            return promisify(fs.unlink)(
              path.resolve(__dirname, "..", "..", "tmp", "uploads", profile_image.key)
            );
          },
        },
        sequelize: connection,
        tableName: "profile_image",
        modelName: "profile_image",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.user, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = ProfileImage;
