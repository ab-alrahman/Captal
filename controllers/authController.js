const asyncHandler = require("express-async-handler");
const generateToken = require('../utils/token')
const crypto = require("crypto");
const {
  User,
  validationLoginUser,
} = require("../models/User");

// generate OTP CODE 

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


/**
 * @desc  Generate OTP and send it to the user
 * @route POST => /api/captal/auth/send-otp
 * @access Public
 */

const sendOTP = asyncHandler(
  async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'رقم الهاتف مطلوب' });
  
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
    let user = await User.findOne({ phone });
  
    if (!user) {
      return res.status(404).json({ message: 'رقم الهاتف غير مسجل لدينا' });
    }
  
    console.log(`📲 OTP for ${phone}: ${otp}`);
    res.json({ message: 'تم إرسال الكود بنجاح' });
  }
) 

/**
 * @desc  Verify OTP and login the user, return JWT in cookie
 * @route POST => /api/captal/auth/verify-otp
 * @access Public
 */

const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });
  
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: 'كود التحقق غير صحيح' });
  }

  if (user.expiresAt < new Date()) {
    return res.status(400).json({ message: 'انتهت صلاحية الكود' });
  }

  user.otp = null;
  user.expiresAt = null;
  await user.save();

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'تم تسجيل الدخول بنجاح',
    user: {
      _id: user._id,
      phone: user.phone,
    }
  });
}
)


module.exports = {
  verifyOTP,
  sendOTP
}