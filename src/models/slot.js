module.exports = (sequelize, DataTypes) => {
    const Slot = sequelize.define('Slot', {
        slotName: {
            type: DataTypes.STRING,
            unique: true,
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
        timeStart: {
            type: DataTypes.DATE,
        },
        timeEnd: {
            type: DataTypes.DATE,
        }
    }, { underscored: true })

    Slot.associate = db => {
        Slot.belongsTo(db.Floor, {
            foreignKey: {
                name: 'floorId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })
    }
    return Slot
}