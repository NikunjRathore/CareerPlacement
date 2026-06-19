const mongoose = require('mongoose');

const placementStatisticsSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  
  // Overall Statistics
  total_students: Number,
  placed_students: Number,
  placement_percentage: Number,
  
  // Department-wise Stats
  department_stats: [{
    department: String,
    total_students: Number,
    placed_students: Number,
    placement_percentage: Number
  }],
  
  // Company-wise Statistics
  company_stats: [{
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    students_hired: Number,
    packages_offered: [Number]
  }],
  
  // Package Statistics
  package_stats: {
    highest_package: Number,
    lowest_package: Number,
    average_package: Number,
    median_package: Number
  },
  
  // Role Distribution
  roles_offered: [{
    role: String,
    count: Number,
    avg_package: Number
  }],
  
  // Timeline
  stats_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('PlacementStatistics', placementStatisticsSchema);
