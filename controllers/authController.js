const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  User,
  validationLoginUser,
} = require("../Models/User");

/**
 * @desc Login New User
 * @route /api/captal/auth/login
 * @method POST
 * @access Public
 */

module.exports.login = asyncHandler(async (req, res) => {
  const { error } = validationLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, phone, firstName, lastName, companyName, DateOfCompany, role } = req.body;

  let user = await User.findOne({ phone });
  if (user) {
    return res.status(400).json({ message: "user already exists" });
  }

  user = new User({
    email,
    firstName,
    lastName,
    phone,
    companyName,
    DateOfCompany,
    role
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d"
  });

  res.status(201).json({
    message: "تم التسجيل بنجاح",
    user: {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      DateOfCompany: user.DateOfCompany,
      role: user.role
    },
    token
  });
});

/**
 * @desc Generate code OTP
 * @route /api/captal/auth/login/code
 * @method POST
 * @access Public
 */

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

module.exports. requestOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "يرجى إدخال رقم الهاتف" });
  }

  const otpCode = generateOTP();
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }

  user.otp = { code: otpCode, expiresAt: expires };
  await user.save();

  console.log(`OTP for ${phone}: ${otpCode}`);

  res.status(200).json({ message: "تم إرسال كود التحقق" });
});

module.exports.verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });

  if (!user || !user.otp || user.otp.code !== otp) {
    return res.status(400).json({ message: "كود التحقق غير صحيح" });
  }

  if (user.otp.expiresAt < new Date()) {
    return res.status(400).json({ message: "انتهت صلاحية الكود" });
  }

  user.otp = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d"
  });

  res.status(200).json({
    message: "تم تسجيل الدخول بنجاح",
    token,
    user: {
      id: user._id,
      phone: user.phone
    }
  });
});
