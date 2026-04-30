import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

export const generateCrudRouter = (Model) => {
  const router = express.Router();

  // @desc    Get all
  // @route   GET /
  // @access  Public
  router.get('/', async (req, res) => {
    try {
      const docs = await Model.find().sort({ order: 1, createdAt: -1 });
      res.status(200).json({ success: true, data: docs });
    } catch (error) {
      // Return empty array if DB is not connected (graceful degradation)
      res.status(200).json({ success: true, data: [] });
    }
  });

  // @desc    Create new
  // @route   POST /
  // @access  Private
  router.post('/', protect, async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, data: doc });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // @desc    Reorder items
  // @route   PUT /reorder
  // @access  Private
  router.put('/reorder', protect, async (req, res) => {
    try {
      const { items } = req.body; // Array of { id, order }
      for (let item of items) {
        await Model.findByIdAndUpdate(item.id, { order: item.order });
      }
      res.status(200).json({ success: true, message: 'Reordered successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // @desc    Update item
  // @route   PUT /:id
  // @access  Private
  router.put('/:id', protect, async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.status(200).json({ success: true, data: doc });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // @desc    Delete item
  // @route   DELETE /:id
  // @access  Private
  router.delete('/:id', protect, async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
