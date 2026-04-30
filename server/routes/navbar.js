import express from 'express';
import Navbar from '../models/Navbar.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get navbar config
// @route   GET /api/navbar
// @access  Public
router.get('/', async (req, res) => {
  try {
    let navbar = await Navbar.findOne();
    if (!navbar) navbar = await Navbar.create({});
    res.status(200).json({ success: true, data: navbar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update navbar config
// @route   PUT /api/navbar
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    let navbar = await Navbar.findOne();
    if (!navbar) {
      navbar = await Navbar.create(req.body);
    } else {
      navbar = await Navbar.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, data: navbar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
