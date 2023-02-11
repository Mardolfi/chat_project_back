const { Model, DataTypes } = require("sequelize");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
            return s3.deleteObject({
              Bucket: 'upload-chat-app',
              Key: attachment.key
            }).promise()
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
