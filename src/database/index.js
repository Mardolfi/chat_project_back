const { Sequelize } = require("sequelize");
const databaseConfig = require("../config/database");

const User = require("../models/User");
const Chat = require("../models/Chat");
const ProfileImage = require("../models/ProfileImage");
const ChatImage = require("../models/ChatImage");
const Message = require("../models/Message");
const Attachment = require("../models/Attachment");
const Requests = require("../models/Requests");

const sequelize = new Sequelize(databaseConfig);

User.init(sequelize);
Requests.init(sequelize);
ProfileImage.init(sequelize);
ChatImage.init(sequelize);
Chat.init(sequelize);
Message.init(sequelize);
Attachment.init(sequelize);

ChatImage.associate(sequelize.models);
Attachment.associate(sequelize.models);
ProfileImage.associate(sequelize.models);
Message.associate(sequelize.models);
Requests.associate(sequelize.models);
User.associate(sequelize.models);
Chat.associate(sequelize.models);

module.exports = sequelize;
