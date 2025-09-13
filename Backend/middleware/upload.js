const multer = require("multer");
const path = require("path");
const FileTypes = require("../utilis/FileTypes");

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
  let dest = path.resolve('Uploads');

  if (file.fieldname === "user_img") {
    dest = path.join(dest, "images", "persons");
  } else if (file.fieldname === "pro_img")
    dest = path.join(dest, "images", "projects");
  else {
    dest = path.join(dest, "files");
  }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' +file.originalname);
  }
})

const createFileFilter = (type) => {
  const allowedTypes = FileTypes(type);
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.ErrorMess = `This type [${file.mimetype}] is invalid for ${type} uploads`;
      cb(new Error("Invalid file type"), false);
    }
  };
};

const uploadImage = multer({ storage, fileFilter: createFileFilter("img") });
const uploadDocument = multer({ storage, fileFilter: createFileFilter("file") });

module.exports = { uploadImage, uploadDocument };
