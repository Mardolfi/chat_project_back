const { Model, DataTypes } = require("sequelize");

class Requests extends Model {
  static init(connection) {
    super.init(
      {
        is_accepted: DataTypes.BOOLEAN,
        is_rejected: DataTypes.BOOLEAN,
      },
      {
        sequelize: connection,
        tableName: "request",
        modelName: "request",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.user, {
      foreignKey: "sender_id",
      as: "request_sender",
    });
    this.belongsTo(models.user, {
      foreignKey: "recipient_id",
      as: "request_recipient"
    })
  }
}

module.exports = Requests;
