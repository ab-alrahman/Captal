const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser , verifyAuthorization } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createMaterialOrder,deleteMatrialOrder,getAllMaterialsOrder,getMaterialOrderByID,updateMaterialOrder,updateStatus} = require('../controllers/martrialOrderController')

// api/captal/material
router.route("/").get(verifyToken,getAllMaterialsOrder).post(verifyToken,createMaterialOrder)
// api/captal/material/:id
router.route("/:id").get(verifyToken,validId,getMaterialOrderByID).put(verifyToken,validId,updateMaterialOrder).delete(verifyToken,validId,deleteMatrialOrder)

module.exports = router
