const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});

module.exports = upload;


// module.exports = upload = (folderName) => {
//   return imageUpload = multer({
//     storage: multer.diskStorage({
//       destination: function (req, file, cb) {
//         const path = `${process.cwd()}/src/assets/uploads/${folderName}/`;
//         fs.mkdirSync(path, { recursive: true })
//         cb(null, path);
//       },

//       // By default, multer removes file extensions so let's add them back
//       filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//       },
//     }),
//     limits: { fileSize: 10000000 },
//     fileFilter: function (req, file, cb) {
//       if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
//         req.fileValidationError = 'Only image files are allowed!';
//         return cb(null, false);
//       }
//       cb(null, true);
//     }
//   })
// }