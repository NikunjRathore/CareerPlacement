const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: String,
  file_url: String,
  file_size: Number,  // in bytes
  upload_date: {
    type: Date,
    default: Date.now
  },
  
  // ATS Score and Analysis
  ats_score: {
    type: Number,
    default: 0,  // 0-100
    min: 0,
    max: 100
  },
  
  // Extracted Resume Content
  extracted_text: String,
  
  // Keyword Analysis
  keywords_found: [String],
  missing_keywords: [String],
  
  // Sections Analysis
  sections: {
    has_objective: Boolean,
    has_education: Boolean,
    has_experience: Boolean,
    has_skills: Boolean,
    has_projects: Boolean,
    has_certifications: Boolean,
    has_contact: Boolean
  },
  
  // Scoring Breakdown
  score_breakdown: {
    format_score: Number,      // 0-20
    keyword_score: Number,     // 0-30
    content_score: Number,     // 0-30
    sections_score: Number,    // 0-20
  },
  
  // Improvement Suggestions
  suggestions: [String],
  
  // Metadata
  is_default: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
