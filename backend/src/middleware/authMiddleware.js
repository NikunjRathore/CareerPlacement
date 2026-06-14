const User = require('../models/User')
const { verifyToken } = require('../services/tokenService')

async function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  const payload = verifyToken(token)

  if (!payload?.id) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const user = await User.findById(payload.id)

  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  req.user = user
  return next()
}

module.exports = protect
