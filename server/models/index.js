const { Sequelize } = require("sequelize");
const config = process.env;

const sequelize = new Sequelize(
  config.DB_NAME || "QLThuVien",
  config.DB_USER || "root",
  config.DB_PASS || "",
  {
    host: config.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
