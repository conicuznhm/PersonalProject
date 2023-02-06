const { validateSignUp, validateLogin } = require('../validators/auth-validators');

const { User } = require('../models');
const bcrypt = require('bcryptjs');
const errorFn = require('../utils/error-fn');
const jwt = require('jsonwebtoken');


exports.signUp = async (req, res, next) => {
    try {
        const value = validateSignUp(req.body);
        const user = await User.findOne({
            where: {
                email: value.email || ''
            }
        })

        if (user) {
            // const err = new Error('Email is already in use');
            // err.statusCode = 400;
            // throw err;
            errorFn('Email is already in use', 400)
        }

        value.password = await bcrypt.hash(value.password, 12)
        await User.create(value)

        res.status(201).json({ message: 'register success!!!' })
    } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
    try {
        const value = validateLogin(req.body);

        const user = await User.findOne({
            where: {
                email: value.email
            }
        })
        if (!user) {
            errorFn('Invalid email or password', 400);
        }
        const isMatch = await bcrypt.compare(value.password, user.password);
        // console.log(isMatch)
        if (!isMatch) {
            errorFn('Invalid email or password', 400);
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt,
                updateAt: user.updateAt
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )
        // console.log(accessToken)
        res.status(200).json({ accessToken })
    } catch (err) { next(err) }
}

exports.getUser = (req, res, next) => {
    res.status(200).json({ user: req.user })
}




















// if (user) {
//     // const err = new Error('Email is already in use');
//     // err.statusCode = 404;
//     // throw err;

//     await User.destroy({
//         where: {
//             id: 1
//         }
//     })
//     throw new Error('delete complete')
// }


