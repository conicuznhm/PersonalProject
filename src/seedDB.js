const bcrypt = require("bcryptjs");
const { User } = require("./models");

const userSeed = async () => {
  const hashPassword = await bcrypt.hash("123", 12);

  const userData = [
    {
      email: "a@gmail.com",
      firstName: "aa",
      lastName: "aaa",
      phone: "0987662614",
      password: hashPassword,
    },
    {
      email: "b@gmail.com",
      firstName: "bb",
      lastName: "bbb",
      phone: "0987662555",
      password: hashPassword,
    },
    {
      email: "c@gmail.com",
      firstName: "cc",
      lastName: "ccc",
      phone: "0667762614",
      password: hashPassword,
    },
    {
      email: "d@gmail.com",
      firstName: "dd",
      lastName: "ddd",
      phone: "0887669914",
      password: hashPassword,
    },
    {
      email: "e@gmail.com",
      firstName: "ee",
      lastName: "eee",
      phone: "0832662090",
      password: hashPassword,
    },
    {
      email: "y@gmail.com",
      firstName: "yy",
      lastName: "yyy",
      phone: "0224661100",
      password: hashPassword,
      role: "offer",
    },
    {
      email: "z@gmail.com",
      firstName: "zz",
      lastName: "zzz",
      phone: "0117662614",
      password: hashPassword,
      role: "offer",
    },
  ];
  let res = await User.bulkCreate(userData);
  console.log(res);
  process.exit(0);
};

userSeed();
