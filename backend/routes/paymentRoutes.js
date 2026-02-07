const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { auth } = require("../middlewares/auth");

router.post("/createOrder", auth, createOrder);
router.post("/verifyPayment", auth, verifyPayment);

module.exports = router;
