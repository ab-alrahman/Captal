const asyncHandler = require("express-async-handler");
const { validationMatrialsOrder, Materials , validationUpdateMatrialsOrder} = require("../models/MaterialsOrder");
const upload  = require("../middlewares/photoUpload");


/**
 * @desc Create Material Order  
 * @route /api/captal/material
 * @method POST
 * @access private
 */

module.exports.createMaterialOrder = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validationMatrialsOrder(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // تحويل إذا البيانات مرسلة كـ JSON strings (بسبب form-data)
    let matrials = req.body.matrials;
    let categories = req.body.categories;
    try {
      if (typeof matrials === "string") {
        matrials = JSON.parse(matrials);
      }
      if (typeof categories === "string") {
        categories = JSON.parse(categories);
      }
    } catch (e) {
      return res.status(400).json({ message: "البيانات غير صالحة، تحقق من matrials أو categories" });
    }

    const existingSerial = await Materials.findOne({ serialNumber: req.body.serialNumber });
    if (existingSerial) {
      return res.status(409).json({ message: "الرقم التسلسلي مستخدم مسبقاً" });
    }

    const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: null };

    const matrial = await Materials.create({
      materialName: req.body.materialName,
      serialNumber: req.body.serialNumber,
      matrials: matrials,
      categories: categories,
      description: req.body.description,
      attachedFile: uploadedFile,
      statusUser: req.user ? "eligible" : "visited"
    });

    res.status(201).json({ message: "تم إنشاء الطلب بنجاح", matrial });
  })
];


/**
 * @desc Get Material Order  
 * @route /api/captal/material
 * @method GET
 * @access private
 */

module.exports.getAllMaterialsOrder = asyncHandler(async (req, res) => {
  const matrials = await Materials.find();
  res.status(200).json(matrials)
})

/**
 * @desc Get Matrial Order By Id  
 * @route /api/captal/matrial/:id
 * @method GET
 * @access private
 */

module.exports.getMaterialOrderByID = asyncHandler(async (req, res) => {
  const material = await Materials.findById(req.params.id);
  res.status(200).json(material)
})

/**
 * @desc Update Matrial Order By Id  
 * @route /api/captal/material/:id
 * @method PUT
 * @access private
 */

module.exports.updateMaterialOrder = asyncHandler(async (req, res) => {
  const { error } = validationUpdateMatrialsOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const matrial = await Materials.findById(req.params.id);
  if (!matrial) {
    return res.status(404).json({ message: "Matrial not found" });
  }

  const updatedMatrial = await Materials.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        matrials: req.body.matrials,
        description: req.body.description,
        statusOrder: req.body.statusOrder,
        categories: req.body.categories
      }
    },
    { new: true }
  );

  res.status(200).json({
    message: "successfully",
    updatedMatrial
  });
});


/**
 * @desc Delete Matrial Order
 * @route /api/captal/material/:id
 * @method DELETE
 * @access private 
 */
module.exports.deleteMatrialOrder = asyncHandler(async (req, res) => {
    const matrial = await Materials.findById(req.params.id);
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
    const updatedstatus = await Materials.findByIdAndUpdate(req.params.id,{
        $set : {
            statusOrder : req.body.statusOrder
        }
    },{new : true})
    res.status(200).json(updatedstatus)
})