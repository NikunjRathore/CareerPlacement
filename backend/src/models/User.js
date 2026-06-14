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
  },
  { timestamps: true },
)

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    department: this.department,
    gradYear: this.gradYear,
    cgpa: this.cgpa,
    phone: this.phone,
    bio: this.bio,
  }
}

module.exports = mongoose.model('User', userSchema)
