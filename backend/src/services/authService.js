const User = require('../models/User')
const { comparePassword, hashPassword } = require('./passwordService')
const { signToken } = require('./tokenService')

async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const { hash, salt } = await hashPassword(password)
  const user = await User.create({
    name,
    email,
    passwordHash: hash,
    passwordSalt: salt,
  })

  return buildAuthResponse(user)
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash, user.passwordSalt)

  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  return buildAuthResponse(user)
}

function buildAuthResponse(user) {
  return {
    user: user.toAuthJSON(),
    token: signToken({ id: user._id.toString() }),
  }
}

module.exports = {
  loginUser,
  registerUser,
}
