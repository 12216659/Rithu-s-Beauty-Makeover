const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find({}).sort('-createdAt');
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, admin, async (req, res) => {
    try {
        const image = await Gallery.create(req.body);
        res.status(201).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const image = await Gallery.findByIdAndDelete(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
