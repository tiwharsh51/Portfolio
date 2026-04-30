import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage, uploadMultiple, uploadPDF } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Upload a single image
// @route   POST /api/upload/image
// @access  Private
router.post('/image', protect, uploadImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }
  
  // Normalize URL
  let fileUrl = req.file.path;
  if (!fileUrl.startsWith('http')) {
    // It's a local file path, convert to URL
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
  }

  res.status(200).json({ success: true, url: fileUrl });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
router.post('/images', protect, uploadMultiple, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please upload image files' });
  }
  
  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map(file => {
    if (file.path.startsWith('http')) return file.path;
    return `${baseUrl}/${file.path.replace(/\\/g, '/')}`;
  });

  res.status(200).json({ success: true, urls });
});

// @desc    Upload PDF
// @route   POST /api/upload/pdf
// @access  Private
router.post('/pdf', protect, uploadPDF, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
  }

  let fileUrl = req.file.path;
  if (!fileUrl.startsWith('http')) {
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
  }

  res.status(200).json({ success: true, url: fileUrl });
});

export default router;
