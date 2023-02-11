require('dotenv').config()

module.exports = {
    dialect: 'mysql',
    host: process.env.MYSQL_ADDON_HOST,
    username: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    define: {
        timestamps: true,
        underscored: true,
    },
}