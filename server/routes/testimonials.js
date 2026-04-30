import Testimonial from '../models/Testimonial.js';
import SiteMeta from '../models/SiteMeta.js';
import { generateCrudRouter } from '../utils/generateCrudRouter.js';
import express from 'express';

const router = generateCrudRouter(Testimonial);

// @desc    Public review submission
// @route   POST /public
// @access  Public
router.post('/public', async (req, res) => {
  try {
    const meta = await SiteMeta.findOne();
    if (!meta?.enablePublicReviews) {
      return res.status(403).json({ success: false, message: 'Public reviews are disabled' });
    }
    
    // Create as public review
    const review = await Testimonial.create({
      ...req.body,
      isPublic: true
    });
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
