const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function createApplication(token, { job_id }) {
  const res = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ job_id })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create application')
  return data
}

export async function getUserApplications(token) {
  const res = await fetch(`${API_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch applications')
  return data
}

export async function updateApplication(token, id, payload) {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update application')
  return data
}

export async function deleteApplication(token, id) {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete application')
  return data
}
