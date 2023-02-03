module.exports = (sequelize, DataTypes) => {
    const Floor = sequelize.define('Floor', {
        floorName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        slotAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
        ,
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }

    }, { underscored: true })

    Floor.associate = db => {
        Floor.belongsTo(db.Park, {
            foreignKey: {
                name: 'parkId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })

        Floor.hasMany(db.Slot, {
            foreignKey: {
                name: 'floorId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })
    }
    return Floor
}