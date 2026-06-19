const express = require('express')
const User = require('../models/User')
const router = express.Router()

// Admin setup endpoint - requires a secret key from env
// Usage: POST /api/admin/promote-to-admin with { email, secret_key }
router.post('/promote-to-admin', async (req, res) => {
  const { email, secret_key } = req.body

  // Check secret key from environment
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'your-secret-key-here'
  
  if (!secret_key || secret_key !== adminSecret) {
    return res.status(403).json({ message: 'Invalid secret key' })
  }

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  try {
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already admin' })
    }

    user.role = 'admin'
    await user.save()

    res.json({ message: `${email} is now an admin`, user: user.toAuthJSON() })
  } catch (error) {
    res.status(500).json({ message: 'Error promoting user', error: error.message })
  }
})

module.exports = router
