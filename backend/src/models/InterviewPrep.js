const mongoose = require('mongoose');

const interviewPrepSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // DSA Progress Tracking
  dsa_topics: [{
    topic: String,  // 'Arrays', 'LinkedList', 'Trees', etc
    problems_solved: Number,
    problems_attempted: Number,
    easy_count: { type: Number, default: 0 },
    medium_count: { type: Number, default: 0 },
    hard_count: { type: Number, default: 0 },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    last_practiced: Date
  }],
  
  // Mock Interviews
  mock_interviews: [{
    company: String,
    role: String,
    interview_date: Date,
    duration_minutes: Number,
    rating: Number,  // 1-5
    interviewer_feedback: String,
    topics_covered: [String],
    performance_score: Number  // 1-100
  }],
  
  // Interview Experience Sharing
  interview_experiences: [{
    company: String,
    role: String,
    interview_date: Date,
    experience_description: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    result: {
      type: String,
      enum: ['selected', 'rejected', 'pending']
    },
    topics_asked: [String],
    helpful_resources: [String]
  }],
  
  // Overall Progress
  total_problems_solved: {
    type: Number,
    default: 0
  },
  total_mock_interviews: {
    type: Number,
    default: 0
  },
  average_interview_score: Number,
  
  last_prep_date: Date
}, { timestamps: true });

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);
