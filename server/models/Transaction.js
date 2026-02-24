const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Transaction = sequelize.define("Transaction", {
  borrowDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("BORROWED", "RETURNED", "OVERDUE", "EXTENDED"),
    defaultValue: "BORROWED",
  },
  extensionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
  },
});

module.exports = Transaction;
