const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Book = sequelize.define("Book", {
  isbn: {
    type: DataTypes.STRING,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  coverUrl: {
    type: DataTypes.STRING,
  },
  publisher: {
    type: DataTypes.STRING,
  },
  publishYear: {
    type: DataTypes.INTEGER,
  },
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: "quantity",
  },
  borrowedQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  available: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.totalQty || 0) - (this.borrowedQty || 0);
    },
  },
});

module.exports = Book;
