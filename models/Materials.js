const mongoose = require("mongoose");
const Joi = require("joi");

const matrialSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  serialNumber: {
    type: Number,
    required: true,
  },
  matrials: {
  
  },
  attachedFile: {
    type:Object,
    default: {
      publicId: null,
      url: ""
      }
  },
  description: {
    type: String,
    default: "Write Notes",
  } 
})

// validation matrials order
function validationMatrialsOrder(obj) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    serialNumber: Joi.number().required(),
    matrials: Joi.array().items(
      Joi.object({
        material: Joi.string().required(),
        quantity: Joi.string().required()
      })
    ).required(),
    description: Joi.string().optional()
  })
  return schema.validate(obj);
}

// validation update matrials order
function validationUpdateMatrialsOrder(obj) {
  const schema = Joi.object({
    matrials: Joi.array().items(
      Joi.object({
        material: Joi.string().required(),
        quantity: Joi.string().required()
      })
    ),
    description: Joi.string()
  })
  return schema.validate(obj);
}


const Matrials = mongoose.model("Matrials", matrialSchema);
module.exports = {
  Matrials,
  validationMatrialsOrder,
  validationUpdateMatrialsOrder
}
