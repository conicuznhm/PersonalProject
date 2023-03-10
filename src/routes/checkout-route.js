const express = require("express");
const router = express.Router();
const checkoutController = require("../controller/checkout-controller");

router.post("/", checkoutController.createCharge);

module.exports = router;
