const Filetypes = (type="img") => {
  let types;
  if (type === "img")
    types = ["image/jpeg", "image/png", "text/plain"];
  else 
    types = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "text/plain",
    ];
  
  return types;
}

module.exports = Filetypes;