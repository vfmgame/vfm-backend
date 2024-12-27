const multer = require("multer");
// const fs = require("fs");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
    // filename: (req, file, cb) => {
    //     cb(null, file.originalname)
    // }
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// });

// const upload = multer({
//     storage: storage
// });


// module.exports = upload;



// Set up multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, `${process.cwd()}/src/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

// Create a multer instance with the storage options
const upload = multer({ storage });



module.exports = upload;