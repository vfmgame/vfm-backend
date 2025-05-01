const Secrets = require("../config");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: Secrets.CLOUDINARY_CLOUD_NAME,
    api_key: Secrets.CLOUDINARY_API_KEY,
    api_secret: Secrets.CLOUDINARY_API_SECRET
})

module.exports = cloudinary;