const { Model, DataTypes } = require("sequelize");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
            return s3.deleteObject({
              Bucket: 'upload-chat-app',
              Key: chat_image.key
            }).promise()
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
