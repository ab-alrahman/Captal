const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const matrialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
    trim: true
  },
  serialNumber: {
    type: Number,
    required: true,
    unique: true
  },
  matrials: {
    type: [
      {
        material: { type: String, required: true },
        quantity: { type: String, required: true }
      }
    ],
    required: true,
    default: []
  },
  attachedFile: {
    publicId: { type: String, default: null },
    url: { type: String, default: "" }
  },
  statusOrder: {
    type: String,
    enum: ["accepted", "not accepted", "pending"],
    default: "pending"
  },
  categories: {
    type: [String],
    required: true,
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'يجب إدخال تصنيف واحد على الأقل'
    }
  },  
  description: {
    type: String,
    default: "Write Notes"
  },
}, {
  timestamps: true
});

// Joi Validation
function validationMatrialsOrder(obj) {
  const schema = Joi.object({
    materialName: Joi.string().required(),
    serialNumber: Joi.number().required(),
    matrials: Joi.array().items(
      Joi.object({
        material: Joi.string().required(),
        quantity: Joi.string().required()
      })
    ).min(1).required(),
    categories: Joi.array().items(Joi.string()).min(1).required(),
    description: Joi.string().optional()
  });
  return schema.validate(obj);
}

function validationUpdateMatrialsOrder(obj) {
  const schema = Joi.object({
    matrials: Joi.array().items(
      Joi.object({
        material: Joi.string().required(),
        quantity: Joi.string().required()
      })
    ),
    statusOrder: Joi.string().valid("accepted", "not accepted", "pending"),
    description: Joi.string(),
    categories: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
}

const Materials = mongoose.model("Matrials", matrialSchema);
module.exports = {
  Materials,
  validationMatrialsOrder,
  validationUpdateMatrialsOrder
};
