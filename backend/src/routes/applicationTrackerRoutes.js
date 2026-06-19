const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getUserApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats
} = require('../controllers/applicationTrackerController');

// All routes require authentication
router.use(protect);

// GET all user applications
router.get('/', getUserApplications);

// GET application stats
router.get('/stats', getApplicationStats);

// CREATE new application
router.post('/', createApplication);

// GET single application
router.get('/:id', getApplication);

// UPDATE application
router.put('/:id', updateApplication);

// DELETE application
router.delete('/:id', deleteApplication);

module.exports = router;
