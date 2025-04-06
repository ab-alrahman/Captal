const express = require("express");
const { createOrderQualification, fileUpload,getAllOrder ,updateOrder,deleteOrder,getOrderById,updateStatus} = require("../controllers/orderController");
const photoUpload = require("../middlewares/photoUpload");
const { verifyToken,verifyUser , verifyAuthorization } = require("../middlewares/verifyToken");
const router = express.Router();
const validId = require('../middlewares/validateId');

// api/captal/order
router.route("/").post(verifyToken, createOrderQualification).get(verifyToken,getAllOrder);

// /api/captal/order/file-upload/:id
router.route("/file-upload/:id").post(verifyToken,validId, photoUpload.single('file'), fileUpload);

// /api/captal/order/:id
router.route("/:id").put(verifyToken,validId, updateOrder).delete(verifyToken,validId, deleteOrder).get(verifyToken,validId, getOrderById);

// /api/captal/order/status/:id
router.route("/status/:id").patch(verifyToken,validId,updateStatus)


module.exports = router