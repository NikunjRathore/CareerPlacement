const multer= require("multer");

const fileFilter= (req,file,cb)=>{
    if(file.mimetype=== "application/pdf")cb(null,true);
    else cb(new Error("Only pdfs are allowed"),false);
}

const upload = multer({ storage: multer.memoryStorage(), fileFilter })
module.exports = upload;