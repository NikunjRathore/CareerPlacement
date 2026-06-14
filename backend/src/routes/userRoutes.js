const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Assuming you have a protect middleware to verify JWT
// const { protect } = require('../middleware/authMiddleware'); 

// Update profile - For now, we'll use a placeholder for authentication
// In a real app, replace (req, res) with (protect, async (req, res) => ...)
router.put('/profile', async (req, res) => {
    try {
        const { name, department, gradYear, cgpa, phone, bio, email } = req.body;

        // Find user by email (as a temporary measure until auth middleware is fully integrated)
        const user = await User.findOne({ email });

        if (user) {
            user.name = name || user.name;
            user.department = department || user.department;
            user.gradYear = gradYear || user.gradYear;
            user.cgpa = cgpa || user.cgpa;
            user.phone = phone || user.phone;
            user.bio = bio || user.bio;

            const updatedUser = await user.save();
            res.json({
                message: 'Profile updated successfully',
                user: updatedUser.toAuthJSON()
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;