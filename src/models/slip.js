module.exports = (sequelize, DataTypes) => {
  const Slip = sequelize.define(
    "Slip",
    {
      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      servicePrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { underscored: true, paranoid: true },
  );

  Slip.associate = (db) => {
    Slip.belongsTo(db.Reservation, {
      foreignKey: {
        name: "reservationId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
  };
  return Slip;
};
