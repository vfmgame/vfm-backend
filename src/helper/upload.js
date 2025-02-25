const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const filetypes = /.jpeg|.jpg|.png|.webp/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: jpeg, jpg, png and webp only!');
  }
};



// Set up multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, `${process.cwd()}/src/uploads`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

// Create a multer instance with the storage options
const upload = multer({ storage, fileFilter });



module.exports = upload;