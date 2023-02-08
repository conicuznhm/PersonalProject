module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('Vehicle', {
        type: {
            type: DataTypes.STRING
        },
        brand: {
            type: DataTypes.STRING
        },
        license: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        vehicleImage: DataTypes.STRING
    }, { underscored: true })

    Vehicle.associate = db => {
        Vehicle.belongsTo(db.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })

        Vehicle.hasMany(db.Reservation, {
            foreignKey: {
                name: 'vehicleId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })
    }

    return Vehicle
}