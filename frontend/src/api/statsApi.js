const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/stats${path}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Stats request failed')
  return data
}

export function createStats(payload, token) {
  return request('/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function getAllStats(token) {
  return request('/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getLatestStats() {
  return request('/latest');
}

export function getStatsByYear(year) {
  return request(`/${year}`)
}

export function deleteStats(id, token) {
  return request(`/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getCompanies() {
  const res = await fetch(`${API_URL}/company`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Company request failed')
  return data
}
