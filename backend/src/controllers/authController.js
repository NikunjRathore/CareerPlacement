const { loginUser, registerUser } = require('../services/authService')

async function register(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const auth = await registerUser({ name, email, password })
    return res.status(201).json(auth)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const auth = await loginUser({ email, password })
    return res.json(auth)
  } catch (error) {
    return res.status(401).json({ message: error.message })
  }
}

function me(req, res) {
  return res.json({ user: req.user.toAuthJSON() })
}

module.exports = {login,me,register}
