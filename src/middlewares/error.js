const chalk = require('chalk');

module.exports = (err, req, res, next) => {
    console.log(chalk.redBright.bold(err))

    const { name } = err

    switch (name) {
        case 'ValidationError': err.statusCode = 400; break;
        case 'TokenExpiredError': err.statusCode = 401; break;
        case 'JsonWebTokenError': err.statusCode = 401; break;
        case 'SequelizeForeignKeyConstraintError': err.statusCode = 400; break;
        default: ;
    }

    res.status(err.statusCode || 500).json({ message: err.message })
}

