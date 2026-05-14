const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({}).sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
