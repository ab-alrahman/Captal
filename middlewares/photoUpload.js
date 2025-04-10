const path = require("path")
const multer = require("multer")
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { cloudinaryUploudImage, cloudinaryRemoveImage } = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Univers",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "avi", "mov"],
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
    format: "jpg",
    quality: "auto:good",
  },
});


const upload = multer({ storage }).single("attachedFile");

module.exports = {
  upload
}
