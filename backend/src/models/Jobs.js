const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    role:{
        type: String,
        required: true,
        trim: true,
    },
    location:{
        type: [String],
        required: true
    },
    ctc:{
        type: Number,
    },
    offerType:{
        type: String,
        required: true,
        trim: true,
    },
    dept:{
        type: [String],
        required: true,
    },
    minCgpa:{
        type: Number,
        required: true,
    },
    minGradYear:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    description:{
        type: String,
        required: true,
        trim: true
    }
    ,
    rounds: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('Jobs', jobSchema)