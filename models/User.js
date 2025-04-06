const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// User schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 13,
      maxlength: 13,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    DateOfCompany: {
      type: Date,
      required: true,
    },
    otp: {
      code: String,
      expiresAt: Date
    },
    role: {
      type: String,
      enum: ["Admin", "Contractor", "Supplier"],
    },
    isAdmin: {
      type: Boolean,
      default:false
    },
    verfied: {
      
    }
  },
  {
    timestamps : true,
  }
);
// validation Register User
function validationLoginUser(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100).required(),
    lastName: Joi.string().trim().min(3).max(100).required(),
    phone: Joi.string().trim().min(13).max(13).required(),
    companyName: Joi.string().trim().min(3).max(100).required(),
    DateOfCompany: Joi.date().required(),
    email: Joi.string().trim().min(3).max(100).required().email(),
    role: Joi.string().required()
  });
  return schema.validate(obj);
}
// validation Update User
function validationUpdateUser(obj) {
  const schema = Joi.object({
  firstName: Joi.string().trim().min(3).max(100),
  lastName: Joi.string().trim().min(3).max(100),
  email: Joi.string().trim().min(3).max(100).email(),
  });
  return schema.validate(obj);
}
// Validate Code
function validateCode(obj) {
  const schema = Joi.object({
    code: Joi.number().min(6).required(),
  });
  return schema.validate(obj);
}

// Generate token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY);
};

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// User model

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validationLoginUser,
  validateCode,
  generateOTP,
  validationUpdateUser
};
