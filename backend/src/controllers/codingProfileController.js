const CodingProfile = require('../models/CodingProfile');
const User = require('../models/User');

// GET user's coding profile
exports.getCodingProfile = async (req, res) => {
  try {
    const profile = await CodingProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Coding profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coding profile', error: error.message });
  }
};

// CREATE or UPDATE coding profile
exports.updateCodingProfile = async (req, res) => {
  try {
    const { leetcode, hackerrank, codechef, github } = req.body;

    let profile = await CodingProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CodingProfile({
        user: req.user._id,
        leetcode,
        hackerrank,
        codechef,
        github
      });
    } else {
      if (leetcode) profile.leetcode = { ...profile.leetcode, ...leetcode };
      if (hackerrank) profile.hackerrank = { ...profile.hackerrank, ...hackerrank };
      if (codechef) profile.codechef = { ...profile.codechef, ...codechef };
      if (github) profile.github = { ...profile.github, ...github };
    }

    // Calculate overall score
    profile.overall_score = calculateOverallScore(profile);
    profile.last_updated = new Date();

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: 'Error updating coding profile', error: error.message });
  }
};

// Calculate overall coding score based on all profiles
function calculateOverallScore(profile) {
  let score = 0;
  let count = 0;

  // LeetCode: max 30 points
  if (profile.leetcode?.rating) {
    score += Math.min((profile.leetcode.rating / 50) * 30, 30);
    count++;
  }

  // HackerRank: max 25 points
  if (profile.hackerrank?.rating) {
    score += Math.min((profile.hackerrank.rating / 50) * 25, 25);
    count++;
  }

  // CodeChef: max 25 points
  if (profile.codechef?.rating) {
    score += Math.min((profile.codechef.rating / 50) * 25, 25);
    count++;
  }

  // GitHub: max 20 points
  if (profile.github?.repositories) {
    score += Math.min((profile.github.repositories / 10) * 20, 20);
    count++;
  }

  return count > 0 ? Math.round(score / count) : 0;
}

// DELETE coding profile
exports.deleteCodingProfile = async (req, res) => {
  try {
    await CodingProfile.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Coding profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coding profile', error: error.message });
  }
};
