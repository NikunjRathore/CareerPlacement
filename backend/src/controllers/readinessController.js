const User = require('../models/User');
const CodingProfile = require('../models/CodingProfile');
const Resume = require('../models/Resume');
const ApplicationTracker = require('../models/ApplicationTracker');

// CALCULATE placement readiness score
exports.calculateReadinessScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate('coding_profile')
      .populate('resume');

    const score = await computeReadinessScore(user);

    // Update user's score
    user.placement_readiness_score = score.total_score;
    await user.save();

    res.json(score);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating readiness score', error: error.message });
  }
};

// COMPUTE readiness score with detailed breakdown
async function computeReadinessScore(user) {
  let total_score = 0;
  const breakdown = {
    academic: { score: 0, max: 20 },
    coding_profile: { score: 0, max: 25 },
    resume: { score: 0, max: 25 },
    applications: { score: 0, max: 20 },
    target_companies: { score: 0, max: 10 }
  };

  // 1. ACADEMIC SCORE (0-20)
  if (user.cgpa) {
    const min_cgpa = 5.0;
    const max_cgpa = 10.0;
    const academic_score = Math.min(20, ((user.cgpa - min_cgpa) / (max_cgpa - min_cgpa)) * 20);
    breakdown.academic.score = Math.max(0, academic_score);
  }

  // 2. CODING PROFILE SCORE (0-25)
  if (user.coding_profile) {
    breakdown.coding_profile.score = Math.min(25, user.coding_profile.overall_score * 0.25);
  }

  // 3. RESUME SCORE (0-25)
  if (user.resume) {
    breakdown.resume.score = Math.min(25, user.resume.ats_score * 0.25);
  }

  // 4. APPLICATIONS PROGRESS (0-20)
  const applications = await ApplicationTracker.find({ user: user._id });
  if (applications.length > 0) {
    const selected = applications.filter(a => a.status === 'selected').length;
    const completed_rounds = applications.filter(a => 
      a.status === 'round1' || a.status === 'round2' || a.status === 'round3' || a.status === 'interview'
    ).length;

    const application_score = (selected * 10) + (completed_rounds * 2);
    breakdown.applications.score = Math.min(20, application_score);
  }

  // 5. TARGET COMPANIES (0-10)
  if (user.target_companies && user.target_companies.length > 0) {
    const companies_score = Math.min(10, user.target_companies.length);
    breakdown.target_companies.score = companies_score;
  }

  // Calculate total
  total_score = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0);

  return {
    total_score: Math.round(total_score),
    max_score: 100,
    breakdown,
    suggestions: generateSuggestions(breakdown, user)
  };
}

// GENERATE suggestions based on score breakdown
function generateSuggestions(breakdown, user) {
  const suggestions = [];

  if (breakdown.academic.score < 10) {
    suggestions.push('Work on improving your CGPA - companies have minimum cutoffs');
  }

  if (breakdown.coding_profile.score < 12) {
    suggestions.push('Create/update your coding profiles (LeetCode, HackerRank, CodeChef)');
  }

  if (breakdown.resume.score < 12) {
    suggestions.push('Upload and optimize your resume - aim for ATS score > 70');
  }

  if (breakdown.applications.score < 5) {
    suggestions.push('Start applying to jobs that match your profile');
  }

  if (breakdown.target_companies.score < 5) {
    suggestions.push('Add target companies to track placements');
  }

  if (user.target_companies && user.target_companies.length === 0) {
    suggestions.push('Browse company profiles and add companies you want to target');
  }

  suggestions.push('Keep your profile updated with latest skills and projects');

  return suggestions;
}

// GET readiness score with detailed breakdown
exports.getReadinessScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('coding_profile')
      .populate('resume');

    const score = await computeReadinessScore(user);

    res.json({
      current_score: user.placement_readiness_score,
      ...score
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching readiness score', error: error.message });
  }
};

// GET readiness progress timeline
exports.getReadinessProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('coding_profile')
      .populate('resume');

    const progress = {
      profile_completion: {
        academic_info: user.department && user.gradYear && user.cgpa ? true : false,
        coding_profile: user.coding_profile ? true : false,
        resume: user.resume ? true : false,
        target_companies: user.target_companies && user.target_companies.length > 0 ? true : false
      },
      completion_percentage: 0
    };

    const completed = Object.values(progress.profile_completion).filter(Boolean).length;
    progress.completion_percentage = (completed / 4) * 100;

    // Get applications summary
    const applications = await ApplicationTracker.find({ user: user._id });
    progress.applications = {
      total: applications.length,
      applied: applications.length,
      shortlisted: applications.filter(a => a.status !== 'applied' && a.status !== 'rejected').length,
      selected: applications.filter(a => a.status === 'selected').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};
