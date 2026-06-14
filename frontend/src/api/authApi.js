const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function authRequest(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export function login(payload) {
  return authRequest('/auth/login', payload)
}

export function register(payload) {
  return authRequest('/auth/register', payload)
}

export async function getProfile(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Could not load profile')
  }

  return data
}
