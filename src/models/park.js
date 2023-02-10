module.exports = (sequelize, DataTypes) => {
    const Park = sequelize.define('Park', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        address: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        maxSlot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        priceRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        minReserveTime: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        parkImage: DataTypes.STRING

    }, { underscored: true })

    Park.associate = db => {
        Park.belongsTo(db.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })

        Park.hasMany(db.Reservation, {
            foreignKey: {
                name: 'parkId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })

        Park.hasMany(db.Floor, {
            foreignKey: {
                name: 'parkId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })
    }
    return Park
}