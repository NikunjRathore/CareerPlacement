const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const protect = require('../middleware/authMiddleware');

// GET: Fetch all notifications (public)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching notifications", 
      error: error.message 
    });
  }
});

// POST: Create new notification (admin only)
router.post('/add_notification', protect, async (req, res) => {
  try {
    // Check if user is admin (for now, checking if email contains 'admin' or has admin role)
    // In production, add a role field to User model
    const isAdmin = req.user.email.toLowerCase().includes('admin') || req.user.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can create notifications' });
    }

    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ message: 'Title, message, and type are required' });
    }

    const newNotification = new Notification({
      title,
      message,
      type,
      createdBy: req.user._id
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Notification creation error:', error);
    res.status(400).json({ 
      message: error.message || "Error adding notification", 
      error: error.message,
      details: error.errors || {}
    });
  }
});

module.exports = router;