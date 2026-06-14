const cors = require('cors')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoutes')

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

module.exports = app
