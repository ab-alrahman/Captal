const asyncHandler = require("express-async-handler")
const{User,validationUpdateUser, validationLoginAndCreateUser} = require("../models/User")
const jwt = require("jsonwebtoken");

/**
 * @desc Create User 
 * @route /api/users/
 * @method POST
 * @access private
 */

const createUser = asyncHandler(async (req, res) => {
    const { error } = validationLoginAndCreateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, phone, firstName, lastName, companyName, DateOfCompany, role } = req.body;
    const user = await User.create({
        email,
        firstName,
        lastName,
        phone,
        companyName,
        DateOfCompany,
        role
    });

    res.status(201).json({
        message: "تم التسجيل بنجاح",
        user: {
            _id: user._id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            companyName: user.companyName,
            DateOfCompany: user.DateOfCompany,
            role: user.role
        }
    });
})

/**
 * @desc Update User 
 * @route /api/users/:id
 * @method PUT
 * @access private
 */

const updateUser = asyncHandler(async (req, res) => {
    const { email, firstName, lastName } = req.body;
    if(req.user.id != req.params.id){
        return res.status(403).json({message : "You are not allowed"})
    }
    const {error} = validationUpdateUser(req.body)
    if(error){
        return res.status(400).json({message : error.details[0].message})
    }
    const updateduser = await User.findByIdAndUpdate(req.params.id,{
        $set : {
            email,
            firstName,
            lastName,
        }
    },{new : true})
    res.status(200).json(updateduser)
})

/**
 * @desc Get All User 
 * @route /api/users
 * @method GET
 * @access private (Only admin)
 */
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find()
    res.status(200).json(users)
})

/**
 * @desc Get User By ID 
 * @route /api/users/:id
 * @method GET
 * @access private
 */
const getUserByID = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({message : "user not found"})
    }
})

/**
 * @desc Delete User 
 * @route /api/users/:id
 * @method DELETE
 * @access private 
 */
const deleteUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)
    if (user) {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"user has been deleted successfully"})
    } else {
        res.status(404).json({message : "user not found"})
    }
})


module.exports = {
    updateUser,
    getAllUsers,
    getUserByID,
    deleteUser,
    createUser
}