const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getCompanyData,
  getLatestCompanyData,
  getRecommendedCompanies,
  addTargetCompany,
  removeTargetCompany,
  getUserTargetCompanies,
  addCompanyData
} = require('../controllers/companyDataController');

// GET historical data for a company (public)
router.get('/history/:company_id', getCompanyData);

// GET latest year company data (public)
router.get('/latest', getLatestCompanyData);

// All routes below require authentication
router.use(protect);

// GET recommended companies for user
router.get('/recommended', getRecommendedCompanies);

// GET user's target companies
router.get('/targets', getUserTargetCompanies);

// ADD company to target list
router.post('/targets', addTargetCompany);

// REMOVE company from target list
router.delete('/targets/:company_id', removeTargetCompany);

// ADD company historical data (admin only)
router.post('/', addCompanyData);

module.exports = router;
