const crypto = require('crypto')
const { promisify } = require('util')

const scrypt = promisify(crypto.scrypt)
const keyLength = 64

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, keyLength)

  return {
    hash: hash.toString('hex'),
    salt,
  }
}

async function comparePassword(password, hash, salt) {
  const incomingHash = await scrypt(password, salt, keyLength)
  const savedHash = Buffer.from(hash, 'hex')

  return (
    savedHash.length === incomingHash.length &&
    crypto.timingSafeEqual(savedHash, incomingHash)
  )
}

module.exports = {
  comparePassword,
  hashPassword,
}
