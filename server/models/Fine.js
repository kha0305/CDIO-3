const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Fine = sequelize.define("Fine", {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
});

module.exports = Fine;
