// const multer = require('multer');
// const path = require('path');

// // Konfigurasi penyimpanan file
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });

// // Filter hanya file gambar
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan'));
//   }
// };

// // Konfigurasi upload
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
// });

// module.exports = upload;

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage untuk Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: `products_casier/${req.body.category || "default"}`,
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

module.exports = upload;
