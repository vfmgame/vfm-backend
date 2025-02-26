const fs = require("fs");
const multer = require("multer");
const path = require("path");

// const fileFilter = (req, file, cb) => {
//   const filetypes = /.jpeg|.jpg|.png|.webp/
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//   if (extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: jpeg, jpg, png and webp only!');
//   }
// };



// // Set up multer storage options
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
//     cb(null, `${process.cwd()}/src/uploads`);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // Create a multer instance with the storage options
// const upload = multer({ storage, fileFilter });



// module.exports = upload;


module.exports = upload = (folderName) => {
  return imageUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const path = `${process.cwd()}/src/assets/uploads/${folderName}/`;
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
      },

      // By default, multer removes file extensions so let's add them back
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
      }
      cb(null, true);
    }
  })
}