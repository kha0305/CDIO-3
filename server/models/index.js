const { Sequelize } = require("sequelize");
const config = process.env;

const url =
  config.DATABASE_URL || config.MYSQL_URL || config.MYSQLURL || config.PG_URL;
let connectionOptions = {};

// Handle direct URL connections from Railway and external providers
if (url) {
  const isPostgres = url.startsWith("postgres");
  connectionOptions = {
    dialect: isPostgres ? "postgres" : "mysql",
    ...(isPostgres ? { dialectModule: require("pg") } : {}),
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  // Local/Direct environment variables
  connectionOptions = {
    host: config.DB_HOST || config.MYSQLHOST || "localhost",
    port:
      config.DB_PORT ||
      config.MYSQLPORT ||
      (config.MYSQLDATABASE ? 3306 : 5432),
    dialect: config.DB_DIALECT || "mysql",
    logging: false,
  };
}

const sequelize = url
  ? new Sequelize(url, connectionOptions)
  : new Sequelize(
      config.DB_NAME ||
        config.MYSQLDATABASE ||
        config.PGDATABASE ||
        "QLThuVien",
      config.DB_USER || config.MYSQLUSER || config.PGUSER || "root",
      config.DB_PASS || config.MYSQLPASSWORD || config.PGPASSWORD || "",
      connectionOptions,
    );

module.exports = sequelize;
