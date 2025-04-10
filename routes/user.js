const express = require("express")
const router = express.Router()
const { getAllUsers, getUserByID, updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken,verifyUser ,verifyAdmin, verifyRoles } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
const checkUser = require("../middlewares/checkUser")
router.route("/").get(getAllUsers);

router.route("/:id").get(validId, getUserByID).patch(verifyToken,validId, updateUser).delete(validId, deleteUser);

module.exports = router
