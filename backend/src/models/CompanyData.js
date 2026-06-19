const mongoose = require('mongoose');

const companyDataSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  
  // Historical Data
  slots_offered: Number,
  students_interviewed: Number,
  students_selected: Number,
  
  // Package Details
  package: {
    min_package: Number,      // in LPA
    max_package: Number,
    avg_package: Number
  },
  
  // Eligibility Criteria
  min_cgpa: Number,
  cutoff_cgpa: Number,
  
  // Roles Offered
  roles: [String],  // e.g., ['Software Engineer', 'Data Scientist']
  
  // Department-wise Stats
  department_stats: [{
    department: String,
    selected_count: Number,
    cutoff_cgpa: Number
  }],
  
  // Internship Details
  is_internship: Boolean,
  internship_package: Number,
  
  // Additional Info
  interview_type: String,  // 'online', 'onsite', 'hybrid'
  duration: String,         // '6 months', 'full-time', etc
  notes: String,
  
  created_year: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure unique company-year combination
companyDataSchema.index({ company: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('CompanyData', companyDataSchema);
