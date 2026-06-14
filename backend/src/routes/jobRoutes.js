const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs');

// @route   GET /api/jobs
// @desc    Get all upcoming job listings
router.get('/', async (req, res) => {
    try {
        // Find all jobs and replace the company ID with the actual Company document
        const jobs = await Job.find().populate('company');
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ message: 'Server error while fetching jobs' });
    }
});

module.exports = router;