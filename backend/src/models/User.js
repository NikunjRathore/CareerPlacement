const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      trim: true,
    },
    gradYear: {
      type: Number,
    },
    cgpa: {
      type: Number,
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    
    // New Fields for Advanced Features
    coding_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProfile'
    },
    
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    
    interview_prep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewPrep'
    },
    
    // Placement Readiness Score (0-100)
    placement_readiness_score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    
    // Companies user is targeting
    target_companies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }],
    
    // Resume upload status
    has_resume: {
      type: Boolean,
      default: false
    },
    
    // Tracking if profile is complete
    profile_completion: {
      academic_info: Boolean,
      coding_profile: Boolean,
      resume: Boolean,
      target_companies: Boolean
    },
    
    // Last active date for analytics
    last_active: Date,
  },
  { timestamps: true },
)

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
    gradYear: this.gradYear,
    cgpa: this.cgpa,
    phone: this.phone,
    bio: this.bio,
    placement_readiness_score: this.placement_readiness_score,
    has_resume: this.has_resume
  }
}

module.exports = mongoose.model('User', userSchema)
