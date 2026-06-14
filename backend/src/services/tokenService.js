const crypto = require('crypto')

function base64Url(input) {
  return Buffer.from(input).toString('base64url')
}

function signToken(payload) {
  const secret = process.env.TOKEN_SECRET || 'career-placement-dev-secret'
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64Url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    }),
  )
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url')

  return `${header}.${body}.${signature}`
}

function verifyToken(token) {
  const secret = process.env.TOKEN_SECRET || 'career-placement-dev-secret'
  const [header, body, signature] = token.split('.')

  if (!header || !body || !signature) {
    return null
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url')

  if (signature !== expectedSignature) {
    return null
  }

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null
  }

  return payload
}

module.exports = {
  signToken,
  verifyToken,
}
