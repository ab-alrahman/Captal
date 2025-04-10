const asyncHandler = require("express-async-handler");
const { validationMatrialsOrder, Matrials , validationUpdateMatrialsOrder} = require("../models/MaterialsOrder");
const { User } = require("../models/User");
const { upload } = require("../middlewares/photoUpload");


/**
 * @desc Create Matrial Order  
 * @route /api/captal/matrial
 * @method POST
 * @access private
 */

module.exports.createMatrial = [
  upload,
  asyncHandler(async (req, res) => {
  const { error } = validationMatrialsOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
    }
    const uploadedFile = req.file
    ? { url: req.file.path, publicId: req.file.filename }
    : { url: "null", publicId: "null" };
    const user = await User.findById(req.user.id);
    const matrials = await Matrials.create({
      userId: user.id,
      serialNumber: req.body.serialNumber,
      matrials: req.body.matrials,
      description: req.body.description,
      attachedFile: uploadedFile
    });
    res.status(201).json({ message: "successfully", matrials });
  })
]

/**
 * @desc Get Matrial Order  
 * @route /api/captal/matrial
 * @method GET
 * @access private
 */

module.exports.getAllMatrials = asyncHandler(async (req, res) => {
  const matrials = await Matrials.find();
  res.status(200).json(matrials)
})

/**
 * @desc Get Matrial Order By Id  
 * @route /api/captal/matrial/:id
 * @method GET
 * @access private
 */

module.exports.getMatrialByID = asyncHandler(async (req, res) => {
  const matrial = await Matrials.findById(req.params.id);
  res.status(200).json(matrial)
})

/**
 * @desc Update Matrial Order By Id  
 * @route /api/captal/matrial/:id
 * @method PUT
 * @access private
 */

module.exports.updateMatrial = asyncHandler(async (req, res) => {
  const {error} = validationUpdateMatrialsOrder(req.body)
      if(error) {
      return res.status(400).json({message: error.details[0].message})
  }
  const matrial = await Matrials.findById(req.params.id);
  if (!matrial) {
    return res.status(404).json({ message: "Matrial not found" });
  }
  const updatedMatrial = await Matrials.findByIdAndUpdate(req.params.id , {
    $set : {
      matrials: req.body.matrials,
      description: req.body.description
    }
},{new:true});
  res.status(200).json(updatedMatrial)
})

/**
 * @desc Delete Matrial
 * @route /api/captal/matrial/:id
 * @method DELETE
 * @access private 
 */
module.exports.deleteMatrial = asyncHandler(async (req, res) => {
    const matrial = await Matrials.findById(req.params.id);
    if (!matrial) {
        return res.status(404).json({ message: "Matrial not found" });
    }
    const DeleteMatrial  = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Order has been deleted successfully",
      DeleteMatrial
    });
});

/**
 * @desc Update Status of Matrials order
 * @route /api/captal/matrial/status/:id
 * @method PUT
 * @access private
 */
module.exports.updateStatus =asyncHandler(async(req ,res) =>{
    const {error} = validationUpdateMatrialsOrder(req.body)
    if(error){
        return res.status(400).json({message : error.details[0].message}) 
    }
    const updatedstatus = await Order.findByIdAndUpdate(req.params.id,{
        $set : {
            status : req.body.status
        }
    },{new : true})
    res.status(200).json(updatedstatus)
})