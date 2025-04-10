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
      length: 10,
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
    attachedFile: {
      type:Object,
      default: {
        publicId: null,
        url: ""
        }
    },
    otp: {
      type: String,
      length: 6
    },
    expiresAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "contractor", "recourse"],
    },
    // verfied: {
      
    // },
  },
  {
    timestamps : true,
  }
);
// validation Login User
function validationLoginAndCreateUser(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(100).required(),
    lastName: Joi.string().trim().min(3).max(100).required(),
    phone: Joi.string().trim().length(10).required(),
    companyName: Joi.string().trim().min(3).max(100).required(),
    DateOfCompany: Joi.date().required(),
    email: Joi.string().trim().min(3).max(100).required().email(),
    role: Joi.string().valid("contractor","recourse","admin").required()
  });
  return schema.validate(obj);
}

// validation Login User
function validationLoginUser(obj) {
  const schema = Joi.object({
    phone: Joi.string().trim().length(10).required(),
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
  validationLoginAndCreateUser,
  validationUpdateUser,
  validateCode,
  generateOTP,
  validationLoginUser
};
