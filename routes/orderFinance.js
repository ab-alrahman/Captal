const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser} = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {getAllOrderFinance,createOrderFinance,deleteOrderFinance,getOrderFinanceById,updateOrderFinance,updateStatus} = require("../controllers/orderFinanceController")
// /api/captal/orderFinance
router.route("/").post(verifyToken,createOrderFinance).get(verifyToken,getAllOrderFinance)

// /api/captal/orderFinance/:id
router.route("/:id").put(verifyToken,validId, updateOrderFinance).delete(verifyToken,validId, deleteOrderFinance).get(verifyToken,validId, getOrderFinanceById); 

// /api/captal/orderFinance/status/:id
router.route("/status/:id").patch(verifyToken, validId, updateStatus)


module.exports = router