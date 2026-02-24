const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Reservation = sequelize.define("Reservation", {
  reservedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("pending", "fulfilled", "cancelled", "expired"),
    defaultValue: "pending",
  },
});

module.exports = Reservation;
