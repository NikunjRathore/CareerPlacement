const mongoose = require('mongoose');

const codingProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  leetcode: {
    username: String,
    rating: Number,
    problems_solved: Number,
    easy: Number,
    medium: Number,
    hard: Number,
    profile_url: String
  },
  hackerrank: {
    username: String,
    rating: Number,
    badges: [String],
    profile_url: String
  },
  codechef: {
    username: String,
    rating: Number,
    problems_solved: Number,
    contests: Number,
    profile_url: String
  },
  github: {
    username: String,
    repositories: Number,
    followers: Number,
    profile_url: String
  },
  overall_score: {
    type: Number,
    default: 0  // 0-100 based on all profiles
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
