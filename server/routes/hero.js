import express from 'express';
import Hero from '../models/Hero.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get hero config
// @route   GET /api/hero
// @access  Public
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({});
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update hero config
// @route   PUT /api/hero
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create(req.body);
    } else {
      hero = await Hero.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
