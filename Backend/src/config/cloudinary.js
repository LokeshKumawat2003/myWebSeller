const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'clothing_store', // folder in Cloudinary
    format: async (req, file) => 'jpg', // convert to jpg
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, '');
      return `${originalName}-${timestamp}`;
    },
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
