const fs = require('fs');
const path = require('path');

const Defimgpath = path.join ("Uploads","Defaultimg");

const DeleteFile = (fpath)=>{

  if (fpath === Defimgpath || fpath === "")
    return;

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

module.exports = {DeleteFile,path,Defimgpath};  



