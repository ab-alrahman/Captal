const express = require("express")
const router = express.Router()
const { login, requestOTP, verifyOTP } = require ("../controllers/authController")

// /api/captal/auth/login
router.post("/login", login);
// /api/captal/auth/login/codeOTP
router.post("/login/codeOTP", requestOTP);
// /api/captal/auth/login/verfiyOTP
router.post("/login/verfiyOTP", verifyOTP);
module.exports = router