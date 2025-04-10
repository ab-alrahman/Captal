const asyncHandler = require("express-async-handler");
const { validationOrderQualification, Order, validationUpdateOrderQualification } = require("../models/OrderQualification");
const { User } = require("../models/User");
const { upload } = require("../middlewares/photoUpload");


/**
 * @desc Create Order Qualification 
 * @route /api/captal/order
 * @method POST
 * @access private
 */

module.exports.createOrderQualification = [
  upload,
  asyncHandler(async (req, res) => {
    const { error } = validationOrderQualification(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message }); 
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const uploadedFile = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "null", publicId: "null" };
    const order = await Order.create({
      userId: user.id,
      LastYearRevenue: req.body.LastYearRevenue,
      RequiredAmount: req.body.RequiredAmount,
      description: req.body.description,
      attachedFile: uploadedFile,
    });

    res.status(201).json({ message: "Successfully created order", order });
  }),
];

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
              description: req.body.description
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