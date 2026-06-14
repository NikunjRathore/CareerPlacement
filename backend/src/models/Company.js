const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    logoUrl: {
        type: String,
    },
    industry: {
        type: String,
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Company', companySchema)