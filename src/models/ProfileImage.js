const { Model, DataTypes } = require("sequelize");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
            return s3.deleteObject({
              Bucket: 'upload-chat-app',
              Key: profile_image.key
            }).promise()
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
