const express = require("express")
const router = express.Router()
const { getAllUsers, getUserByID, updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken,verifyUser , verifyAuthorization } = require("../middlewares/verifyToken");
const validId = require('../middlewares/validateId');
router.route("/").get(getAllUsers);

router.route("/:id").get(validId, getUserByID).patch(verifyToken,validId, updateUser).delete(validId, deleteUser);

module.exports = router
