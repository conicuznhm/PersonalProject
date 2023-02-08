require('dotenv').config()
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const notFoundMW = require("./middlewares/not-found");
const errorMW = require("./middlewares/error");
const authRoute = require('./routes/auth-route');
const authenticateMiddleware = require('./middlewares/authenticate');
const userRoute = require('./routes/user-route');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoute)

app.use('/users', authenticateMiddleware, userRoute)


app.use(notFoundMW)
app.use(errorMW)


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(chalk.yellowBright.bold(`server on port: ${port}...`)));



























//////// const { sequelize } = require('./models');
//////// sequelize.sync({ force: true });