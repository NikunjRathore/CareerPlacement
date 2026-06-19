const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs');
const adminProtect = require('../middleware/adminMiddleware');

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

router.post('/add_job', adminProtect, async (req, res) => {
    try {
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({ 
            message: "Error creating job post", 
            error: error.message 
        });
    }
})

module.exports = router;