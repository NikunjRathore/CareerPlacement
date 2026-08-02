const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {addResume, returnAnalysis} = require('../controllers/resumeController');
const upload= require("../utils/multerHelper")

// ADD resume
router.post('/add',protect,upload.single("resume_pdf"), addResume);
router.get('/analysis',protect, returnAnalysis);


module.exports = router;
