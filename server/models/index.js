const { Sequelize } = require("sequelize");
const config = process.env;

const sequelize = new Sequelize(
  config.DB_NAME || config.MYSQLDATABASE || "QLThuVien",
  config.DB_USER || config.MYSQLUSER || "root",
  config.DB_PASS || config.MYSQLPASSWORD || "",
  {
    host: config.DB_HOST || config.MYSQLHOST || "localhost",
    port: config.DB_PORT || config.MYSQLPORT || 3306,
    dialect: "mysql",
    logging: false,
  },
);

module.exports = sequelize;
