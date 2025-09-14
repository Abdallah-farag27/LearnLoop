const fs = require('fs');
const {sep} = require('path');

const Defimgpath = "uploads/Defaultimg.jpg";

const DeleteFile = (fpath)=>{

  if (fpath === Defimgpath || fpath === "")
    return;

  // using regex to converting / to \ for saving sep from path package
  // seperator differ between Operating systems  
  fpath = fpath.replace(/\//g, sep);

  let isDeleted = false;
  fs.access(fpath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(fpath, (err) => {
        if (err) console.log("Error deleting old file:", err);
        else {
          console.log("Old file deleted successfully");
          isDeleted = true;
        }
      });
    }
  });
  return isDeleted;
} 

module.exports = {DeleteFile,Defimgpath};  



