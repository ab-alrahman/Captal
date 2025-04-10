const express = require("express")
const router = express.Router()
const { sendOTP,verifyOTP } = require("../controllers/authController")


// /api/captal/auth/send-otp
router.post("/send-otp", sendOTP);
// /api/captal/auth/verify-otp
router.post("/verify-otp", verifyOTP);
module.exports = router