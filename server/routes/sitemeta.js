import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lazy import to avoid crash on startup when DB is not connected
const getSiteMeta = async () => {
  const { default: SiteMeta } = await import('../models/SiteMeta.js');
  return SiteMeta;
};

// @desc    Get site meta
// @route   GET /api/sitemeta
// @access  Public
router.get('/', async (req, res) => {
  try {
    const SiteMeta = await getSiteMeta();
    let sitemeta = await SiteMeta.findOne();
    if (!sitemeta) {
      // Return defaults instead of creating in DB (no DB = no crash)
      sitemeta = {
        siteTitle: 'Portfolio',
        metaDescription: '',
        maintenanceMode: false,
        contactFormEnabled: true,
        copyrightName: 'Portfolio',
        footerText: '',
        primaryColor: '#6366f1',
        accentColor: '#f59e0b',
      };
    }
    res.status(200).json({ success: true, data: sitemeta });
  } catch (error) {
    // Return safe defaults on any error (e.g. no DB connection)
    res.status(200).json({
      success: true,
      data: {
        siteTitle: 'Portfolio',
        maintenanceMode: false,
        contactFormEnabled: true,
        copyrightName: 'Portfolio',
        footerText: '',
        primaryColor: '#6366f1',
        accentColor: '#f59e0b',
      }
    });
  }
});

// @desc    Update site meta
// @route   PUT /api/sitemeta
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const SiteMeta = await getSiteMeta();
    let sitemeta = await SiteMeta.findOne();
    if (!sitemeta) {
      sitemeta = await SiteMeta.create(req.body);
    } else {
      sitemeta = await SiteMeta.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
      });
    }
    res.status(200).json({ success: true, data: sitemeta });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
