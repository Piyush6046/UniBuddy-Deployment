const Razorpay = require("razorpay");
const User = require("../models/User");
const crypto = require("crypto");

const instance = new Razorpay({
    key_id: "rzp_test_R6VMtQTtVSy3Pz",
    key_secret: "CEVkkbsQAngHr3wqp1Fa5IFs",
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Payment Order Error:", error);
        res.status(500).json({ success: false, message: "Could not create order" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", "CEVkkbsQAngHr3wqp1Fa5IFs")
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment verified, update user status
            await User.findByIdAndUpdate(userId, { isPremium: true });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully, you are now a Premium member!",
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
