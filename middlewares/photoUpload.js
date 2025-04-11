const path = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Univers",
      public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
      resource_type: "auto", 
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "avi", "mov", "pdf"],
    };
  },
});

const upload = multer({ storage }).single("attachedFile");

module.exports = upload; 
