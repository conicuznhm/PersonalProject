module.exports = (sequelize, DataTypes) => {
    const role = ['customer', 'offer'];
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[0-9]{10}$/
            }
        },
        role: {
            type: DataTypes.ENUM(...role),
            allowNull: false,
            defaultValue: role[0]
        }
    }, {
        underscored: true
    })

    User.associate = db => {
        User.hasMany(db.Vehicle, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })

        User.hasMany(db.Park, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        })
    }

    return User
}