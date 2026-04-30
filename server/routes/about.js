import express from 'express';
import About from '../models/About.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get about config
// @route   GET /api/about
// @access  Public
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // Return defaults without writing to DB (avoids crash when DB not connected)
      return res.status(200).json({
        success: true,
        data: { name: '', tagline: '', bio: '', profilePhotoUrl: '', resumeUrl: '', yearsOfExperience: 0, projectsCompleted: 0, happyClients: 0 }
      });
    }
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    // Return empty defaults on any error (e.g. DB not connected)
    res.status(200).json({
      success: true,
      data: { name: '', tagline: '', bio: '', profilePhotoUrl: '', resumeUrl: '', yearsOfExperience: 0, projectsCompleted: 0, happyClients: 0 }
    });
  }
});

// @desc    Update about config
// @route   PUT /api/about
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { _id, __v, ...updateData } = req.body;
    console.log('Updating About with:', updateData);
    
    let about = await About.findOne();
    if (!about) {
      about = await About.create(updateData);
    } else {
      about = await About.findOneAndUpdate({}, updateData, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
