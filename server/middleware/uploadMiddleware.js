import multer from 'multer';
import { storage as cloudinaryStorage } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

// Setup disk storage for local fallback
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Setup multer with Cloudinary or Local storage
const upload = multer({ 
  storage: isCloudinaryConfigured ? cloudinaryStorage : diskStorage 
});

export const uploadImage = upload.single('image');
export const uploadMultiple = upload.array('images', 10);
export const uploadPDF = upload.single('pdf');
