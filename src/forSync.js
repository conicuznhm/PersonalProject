const { sequelize } = require("./models");

sequelize
  .sync({ force: true })
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err), process.exit(1);
  });
