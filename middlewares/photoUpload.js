const path = require("path")
const multer = require ("multer")

// Photo Storage
const photoStorage = multer.diskStorage({
    destination : function(req , file ,cb) {
        cb (null , path.join(__dirname , "../images"))
    },
    filename : function(req, file ,cb){
        if (file){
            cb (null , new Date().toISOString().replace(/:/g,"-")+file.originalname)
        } else {
            cb (null ,false)
        }
    }
})
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",               // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
];
// Photo Upload Middleware
const photoUpload = multer({
    storage : photoStorage ,
    fileFilter : function (req , file , cb){
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null , true)
        } else {
            cb({meassage : "Unsupported file format"} , false)
        }
    },
    limits : { fieldSize :5* 1024 * 1024 }
})

module.exports = photoUpload