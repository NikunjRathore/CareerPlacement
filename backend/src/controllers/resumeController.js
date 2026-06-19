const Resume = require('../models/Resume');
const User = require('../models/User');

// Common technical keywords for ATS scoring
const TECHNICAL_KEYWORDS = [
  'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'React', 'Node.js',
  'Express', 'HTML', 'CSS', 'Git', 'Linux', 'AWS', 'Docker', 'Kubernetes',
  'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'JIRA'
];

const REQUIRED_SECTIONS = ['education', 'skills', 'experience', 'contact'];

// GET user's resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

// UPLOAD resume with ATS analysis
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { filename, file_url } = req.body;
    const extracted_text = req.body.extracted_text || '';

    // Find existing resume or create new
    let resume = await Resume.findOne({ user: req.user._id, is_default: true });

    if (!resume) {
      resume = new Resume({ user: req.user._id });
    }

    resume.filename = filename || req.file.originalname;
    resume.file_url = file_url || `/uploads/${req.file.filename}`;
    resume.file_size = req.file.size;
    resume.upload_date = new Date();
    resume.extracted_text = extracted_text;
    resume.is_default = true;
    resume.version = (resume.version || 0) + 1;

    // Analyze resume for ATS
    const analysis = analyzeResumeForATS(extracted_text);
    resume.keywords_found = analysis.keywords_found;
    resume.missing_keywords = analysis.missing_keywords;
    resume.sections = analysis.sections;
    resume.score_breakdown = analysis.score_breakdown;
    resume.ats_score = analysis.total_score;
    resume.suggestions = analysis.suggestions;

    // Update user profile
    const user = await User.findById(req.user._id);
    user.has_resume = true;
    user.resume = resume._id;
    await user.save();

    await resume.save();

    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Error uploading resume', error: error.message });
  }
};

// ANALYZE resume for ATS score
function analyzeResumeForATS(text) {
  const lowerText = text.toLowerCase();

  // 1. Check for required sections (20 points)
  const sections = {
    has_objective: lowerText.includes('objective') || lowerText.includes('summary'),
    has_education: lowerText.includes('education') || lowerText.includes('degree'),
    has_experience: lowerText.includes('experience') || lowerText.includes('work'),
    has_skills: lowerText.includes('skills') || lowerText.includes('technical'),
    has_projects: lowerText.includes('project') || lowerText.includes('portfolio'),
    has_certifications: lowerText.includes('certification') || lowerText.includes('certified'),
    has_contact: lowerText.includes('email') || lowerText.includes('phone') || lowerText.includes('linkedin')
  };

  const sections_present = Object.values(sections).filter(Boolean).length;
  const sections_score = (sections_present / 7) * 20;

  // 2. Check for keywords (30 points)
  const found_keywords = [];
  const missing_keywords = [];

  TECHNICAL_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      found_keywords.push(keyword);
    } else {
      missing_keywords.push(keyword);
    }
  });

  const keyword_score = (found_keywords.length / TECHNICAL_KEYWORDS.length) * 30;

  // 3. Format score (20 points) - check for common formatting issues
  const lines = text.split('\n').length;
  const words = text.split(/\s+/).length;
  let format_score = 20;

  if (lines < 10) format_score -= 5;  // Too short
  if (words < 100) format_score -= 5; // Not enough content
  if (text.includes('http') && !text.includes('linkedin')) format_score -= 2; // Possibly has bad URLs

  // 4. Content score (30 points)
  let content_score = 30;
  if (words < 200) content_score -= 10;
  if (!lowerText.includes('achievement') && !lowerText.includes('accomplished')) content_score -= 5;
  if (!lowerText.includes('improve') && !lowerText.includes('increase') && !lowerText.includes('reduce')) content_score -= 5;

  // Calculate total
  const total_score = Math.round(
    Math.max(0, Math.min(100, sections_score + keyword_score + format_score + content_score))
  );

  // Suggestions
  const suggestions = [];
  if (sections_present < 5) suggestions.push('Add more sections (Education, Experience, Skills, Projects)');
  if (found_keywords.length < 10) suggestions.push('Include more technical keywords relevant to your role');
  if (words < 200) suggestions.push('Add more details about your achievements and responsibilities');
  if (!sections.has_projects) suggestions.push('Add a Projects section showcasing your work');
  if (!sections.has_certifications && total_score < 70) suggestions.push('Add certifications if you have any');
  if (!lowerText.includes('linkedin')) suggestions.push('Include your LinkedIn profile URL');

  return {
    keywords_found: found_keywords,
    missing_keywords: missing_keywords,
    sections,
    score_breakdown: {
      format_score: Math.round(format_score),
      keyword_score: Math.round(keyword_score),
      content_score: Math.round(content_score),
      sections_score: Math.round(sections_score)
    },
    total_score,
    suggestions
  };
}

// GET ATS score details
exports.getATSDetails = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({
      ats_score: resume.ats_score,
      score_breakdown: resume.score_breakdown,
      keywords_found: resume.keywords_found.length,
      total_keywords: TECHNICAL_KEYWORDS.length,
      suggestions: resume.suggestions,
      sections: resume.sections
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ATS details', error: error.message });
  }
};

// UPDATE resume suggestions after review
exports.updateResumeSuggestions = async (req, res) => {
  try {
    const { suggestions } = req.body;

    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    resume.suggestions = suggestions;
    await resume.save();

    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Error updating resume', error: error.message });
  }
};

// DELETE resume
exports.deleteResume = async (req, res) => {
  try {
    await Resume.findOneAndDelete({ user: req.user._id });
    const user = await User.findById(req.user._id);
    user.has_resume = false;
    user.resume = null;
    await user.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};
