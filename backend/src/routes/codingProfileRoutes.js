const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getCodingProfile,
  updateCodingProfile,
  deleteCodingProfile
} = require('../controllers/codingProfileController');

// All routes require authentication
router.use(protect);

// GET user's coding profile
router.get('/', getCodingProfile);

// CREATE/UPDATE coding profile
router.post('/', updateCodingProfile);

// DELETE coding profile
router.delete('/', deleteCodingProfile);

module.exports = router;
