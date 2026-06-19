const cors = require('cors')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoutes')
const companyRoutes = require('./routes/companyRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const codingProfileRoutes = require('./routes/codingProfileRoutes')
const applicationTrackerRoutes = require('./routes/applicationTrackerRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const companyDataRoutes = require('./routes/companyDataRoutes')
const readinessRoutes = require('./routes/readinessRoutes')
const placementStatsRoutes = require('./routes/placementStatsRoutes')


const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'CareerPlacement API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/coding-profile', codingProfileRoutes)
app.use('/api/applications', applicationTrackerRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/company-data', companyDataRoutes)
app.use('/api/readiness', readinessRoutes)
app.use('/api/stats', placementStatsRoutes)

module.exports = app
