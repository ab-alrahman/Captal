const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  LastYearRevenue: {
    type: String,
    required: true
  },
  RequiredAmount: {
    type: Number,
    required: true
  },
  attachedFile: {
    type:Object,
    default: {
      publicId: null,
      url: ""
      }
  },
  status:{
    type:String,
    enum: ["AC", "NAC", "PEN"],
    default:"PEN"
  }
},
  {
    timestamps : true,
  }
)

// validation order Qualification
function validationOrderQualification(obj) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    LastYearRevenue: Joi.string().required(),
    RequiredAmount: Joi.number().required(),
  })
  return schema.validate(obj);
}
// validation update order Qualification
function validationUpdateOrderQualification(obj) {
  const schema = Joi.object({
    LastYearRevenue: Joi.string(),
    RequiredAmount: Joi.number(),
    status: Joi.string(),
  })
  return schema.validate(obj);
}

const Order = mongoose.model("Order", orderSchema);
module.exports = {
  Order,
  validationOrderQualification,
  validationUpdateOrderQualification
}
