const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "librarian", "reader"),
    defaultValue: "reader",
  },
});

module.exports = User;
