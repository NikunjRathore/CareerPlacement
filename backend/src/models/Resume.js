const mongoose = require('mongoose');

const PriorityImprovementSchema= new mongoose.Schema({
  priority:{
    type: String,
    enum: ["High", 'Medium', 'Low'],
    required:true
  },
  issue:{
    type:String,
    required:true
  },
  solution:{
    type: String,
    required:true
  }
},{_id:false})

const resumeSchema= new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  job_description:{
    type: String,
    required: true
  },
  score:{
    type: Number,
    required: true
  },
  priority_improvements:[PriorityImprovementSchema],
  final_feedback:{
    type: String,
    required:true
  }
},{timestamps:true})

module.exports = mongoose.model('Resume', resumeSchema);
