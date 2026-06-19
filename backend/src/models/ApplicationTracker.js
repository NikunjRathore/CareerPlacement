const mongoose = require('mongoose');

const applicationTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'rejected', 'round1', 'round2', 'round3', 'interview', 'selected', 'waitlist'],
    default: 'applied'
  },
  current_round: {
    type: Number,
    default: 0
  },
  rounds_completed: {
    type: [String],
    default: []  // e.g., ['online_test', 'technical_round', 'hr_round']
  },
  rounds_pending: {
    type: [String],
    default: []
  },
  notes: String,
  interview_date: Date,
  applied_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ApplicationTracker', applicationTrackerSchema);
