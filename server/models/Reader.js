const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Reader = sequelize.define("Reader", {
  cardId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "suspended", "expired"),
    defaultValue: "active",
  },
});

module.exports = Reader;
