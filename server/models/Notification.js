const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Notification = sequelize.define("Notification", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("info", "warning", "success", "error"),
    defaultValue: "info",
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ReaderId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null means system-wide notification or for admin
  },
});

module.exports = Notification;
