require('dotenv').config()

module.exports = {
    dialect: 'mysql',
    host: process.env.MYSQL_ADDON_HOST || 'localhost',
    username: process.env.MYSQL_ADDON_USER || 'root',
    password: process.env.MYSQL_ADDON_PASSWORD || 'ml160707',
    database: process.env.MYSQL_ADDON_DB || 'chat_app',
    define: {
        timestamps: true,
        underscored: true,
    },
}