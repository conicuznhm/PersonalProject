const omise = require("omise")({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

exports.createCharge = async (req, res, next) => {
  try {
    const { email, name, amount, token } = req.body;
    const customer = await omise.customers.create({
      email,
      description: `${name}, id (123)`,
      card: token,
    });

    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      customer: customer.id,
    });
    // console.log(charge);
    res.status(201).json({
      amount: charge.amount,
      status: charge.status,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
