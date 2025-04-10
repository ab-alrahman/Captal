const express = require("express");
const router = express.Router();
const { verifyToken,verifyUser , verifyAuthorization } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const {createMatrial,deleteMatrial,getAllMatrials,getMatrialByID,updateMatrial} = require('../controllers/martrialOrderController')

// api/captal/matrial
router.route("/").get(verifyToken,getAllMatrials).post(verifyToken,createMatrial)
// api/captal/matrial/:id
router.route("/:id").get(verifyToken,validId,getMatrialByID).put(verifyToken,validId,updateMatrial).delete(verifyToken,validId,deleteMatrial)

module.exports = router
