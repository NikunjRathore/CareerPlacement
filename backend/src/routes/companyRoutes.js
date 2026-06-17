const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// POST: Create a new company
router.post('/add_company', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error('Company creation error:', error);
    res.status(400).json({ 
      message: error.message || "Error adding company", 
      error: error.message,
      details: error.errors || {}
    });
  }
});

router.get('/', async (req, res) => {
    try {
      const companies = await Company.find();
      res.json(companies);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching companies", 
      error: error.message 
    });
  }

})
module.exports = router;