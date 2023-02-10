const jwt = require("jsonwebtoken");
const errorFn = require('../utils/error-fn');
const { User } = require('../models');

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {

            errorFn('you are unauthorized', 401);
        }

        const token = authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({
            where: { id: payload.id },
            attributes: {
                exclude: ['password']
            }
        })
        if (!user) {
            errorFn('you are not authorized', 401);
        }
        req.user = user;

        console.log(req)
        console.log(authorization)
        console.log(user)

        next();
    } catch (err) { next(err) }
};