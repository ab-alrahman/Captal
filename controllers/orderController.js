const asyncHandler = require("express-async-handler");
const { validationOrderQualification, Order, validationUpdateOrderQualification } = require("../models/Order");
const { User } = require("../Models/User");
const fs = require("fs");
const path = require("path");
const { cloudinaryUploudImage, cloudinaryRemoveImage } = require("../utils/cloudinary");

/**
 * @desc Create Order Qualification 
 * @route /api/captal/order
 * @method POST
 * @access private
 */
module.exports.createOrderQualification = asyncHandler(async (req, res) => {
  // if (!req.user || !req.user.id) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // if (!req.file) {
  //   return res.status(400).json({ message: "يرجى إرفاق ملف" });
  // }
  //   const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // const result = await cloudinaryUploudImage(imagePath);
  // const fileData = {
  //   publicId: result.public_id,
  //   url: result.secure_url
  // };

  // fs.unlinkSync(req.file.path);

  const { error } = validationOrderQualification(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.user.id);

  const order = await Order.create({
    userId: user.id,
    LastYearRevenue: req.body.LastYearRevenue,
    RequiredAmount: req.body.RequiredAmount,
  });

  res.status(201).json({ message: "successfully", order });
});

/**
 * @desc file Upload
 * @route /api/captal/order/:id/file-upload
 * @method POST
 * @access private (only logged in user)
 */

module.exports.fileUpload = asyncHandler(async (req, res) => {
  // 1- Validation
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  // 2- Get the image path
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3- Upload to Cloudinary
  const result = await cloudinaryUploudImage(imagePath);

  // 4- Get the order ID (ensure you're passing orderId in params or body)
  const orderId = req.params.id || req.body.orderId;
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 5- Remove old file from Cloudinary if exists
  if (order.attachedFile && order.attachedFile.publicId) {
    await cloudinaryRemoveImage(order.attachedFile.publicId);
  }

  // 6- Update order with new file
  order.attachedFile = {
    publicId: result.public_id,
    url: result.secure_url
  };
  await order.save();

  // 7- Respond to client
  res.status(200).json({
    message: "Your file uploaded successfully",
    attachedFile: {
      publicId: result.public_id,
      url: result.secure_url
    }
  });

  // 8- Remove file from server
  fs.unlinkSync(imagePath);
});


/**
 * @desc Get All Order
 * @route /api/order
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllOrder= asyncHandler(async(req,res) =>{
  const order = await Order.find();
res.status(200).json(order)
})
/**
 * @desc Get Order By Id
 * @route /api/captal/order/:id
 * @method GET
 * @access private 
 */
module.exports.getOrderById= asyncHandler(async(req,res) =>{
  const order = await Order.findById(req.params.id);
res.status(200).json(order)
})

/**
 * @desc Update Order
 * @route /api/captal/order/:id
 * @method PUT
 * @access private 
 */
module.exports.updateOrder = asyncHandler(async (req, res) => {
    const {error} = validationUpdateOrderQualification(req.body)
    if(error) {
    return res.status(400).json({message: error.details[0].message})
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
  }
  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not allowed to update this order" });
  }
        const updatedorder = await Order.findByIdAndUpdate(req.params.id , {
            $set : {
              LastYearRevenue: req.body.LastYearRevenue,
              RequiredAmount: req.body.RequiredAmount,
            }
        },{new:true});
        res.status(200).json(updatedorder);
    },{new:true});
    
/**
 * @desc Delete Order
 * @route /api/captal/order/:id
 * @method DELETE
 * @access private (only user)
 */
module.exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "Order has been deleted successfully",
    });
});

/**
 * @desc Update Status of Order
 * @route /api/captal/order/status/:id
 * @method PUT
 * @access private
 */
module.exports.updateStatus =asyncHandler(async(req ,res) =>{
    const {error} = validationUpdateOrderQualification(req.body)
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