const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  calculateReadinessScore,
  getReadinessScore,
  getReadinessProgress
} = require('../controllers/readinessController');

// All routes require authentication
router.use(protect);

// GET current readiness score with breakdown
router.get('/score', getReadinessScore);

// CALCULATE/UPDATE readiness score
router.post('/calculate', calculateReadinessScore);

// GET readiness progress
router.get('/progress', getReadinessProgress);

module.exports = router;
