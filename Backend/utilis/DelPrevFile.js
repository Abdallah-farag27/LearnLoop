const fs = require('fs');
const path = require('path');

const DeleteFile = (fpath)=>{
  const prevFilePath = path.join(__dirname, "..", fpath);
  let isDeleted = false;
  fs.access(prevFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(prevFilePath, (err) => {
        if (err) 
          console.log("Error deleting old file:", err);
        else {
          console.log("Old file deleted successfully");
          isDeleted = true;
        }
      });
    }
  });
  return isDeleted;
} 

module.exports = {DeleteFile,path};  



