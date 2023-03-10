module.exports = (sequelize, DataTypes) => {
  const status = ["reserve", "timesUp", "cancel", "activated"];
  const Reservation = sequelize.define(
    "Reservation",
    {
      timeStart: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      timeEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      priceRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      reserveCost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM(...status),
        allowNull: false,
        defaultValue: status[0],
      },
    },
    { underscored: true, paranoid: true },
  );

  Reservation.associate = (db) => {
    Reservation.belongsTo(db.Vehicle, {
      foreignKey: {
        name: "vehicleId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });

    Reservation.belongsTo(db.Park, {
      foreignKey: {
        name: "parkId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });

    Reservation.belongsTo(db.Slot, {
      foreignKey: {
        name: "slotId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });

    Reservation.hasOne(db.Slip, {
      foreignKey: {
        name: "reservationId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
  };

  return Reservation;
};

// slotName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         notEmpty: true
//     }
// },
// slotId: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         notEmpty: true
//     }
// },
