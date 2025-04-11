const express = require("express");
const {createOrderQualification,deleteOrderQualification,getAllOrderQualifications, getOrderQualificationById, updateOrderQualification, updateStatus} = require("../controllers/orderQualificationController");
const { verifyToken,verifyUser} = require("../middlewares/verifyToken");
const router = express.Router();
const validId = require('../middlewares/validateId');


// api/captal/orderQualification
router.route("/").post(verifyToken, createOrderQualification).get(verifyToken,getAllOrderQualifications);

// /api/captal/orderQualification/:id
router.route("/:id").put(verifyToken,validId, updateOrderQualification).delete(verifyToken,validId, deleteOrderQualification).get(verifyToken,validId, getOrderQualificationById); 

// /api/captal/orderQualification/status/:id
router.route("/status/:id").patch(verifyToken, validId, updateStatus)



module.exports = router