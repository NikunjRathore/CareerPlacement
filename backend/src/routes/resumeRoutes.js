const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getResume,
  uploadResume,
  getATSDetails,
  updateResumeSuggestions,
  deleteResume
} = require('../controllers/resumeController');

// All routes require authentication
router.use(protect);

// GET user's resume
router.get('/', getResume);

// GET ATS score details
router.get('/ats/details', getATSDetails);

// UPLOAD resume
router.post('/', uploadResume);

// UPDATE resume suggestions
router.put('/suggestions', updateResumeSuggestions);

// DELETE resume
router.delete('/', deleteResume);

module.exports = router;
