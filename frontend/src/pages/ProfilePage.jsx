import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateProfileState, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dept: user?.department || '',
    cgpa: user?.cgpa || '',
    gradYear: user?.gradYear || '',
    bio: user?.bio || '',
  })

  // Sync form data whenever the user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dept: user.department || '',
        cgpa: user.cgpa || '',
        gradYear: user.gradYear || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          department: formData.dept // Map 'dept' from state to 'department' for the backend
        }),
      })

      const data = await response.json()
      if (response.ok) {
        updateProfileState(data.user)
        setMessage('Profile updated successfully!')
      } else {
        setMessage(data.message || 'Failed to update profile')
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <button onClick={() => navigate('/user/dashboard')} className="text-teal-400 font-semibold hover:underline">
          &larr; Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold">Student Profile</h1>
        <div className="w-20"></div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Profile Top Section */}
        <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl mb-8 flex items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-teal-400 to-indigo-600 flex items-center justify-center text-4xl font-bold shadow-xl shadow-teal-500/20">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white">{formData.name}</h2>
            <p className="text-teal-400 text-lg mt-1">{formData.dept || 'Department not set'}</p>
            <div className="mt-4 flex gap-3">
               <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium uppercase tracking-wider text-slate-300">Student</span>
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium uppercase tracking-wider">Active</span>
            </div>
            {message && (
              <p className={`mt-4 text-sm font-semibold ${message.includes('successfully') ? 'text-emerald-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </section>

        {/* Details Form */}
        <form onSubmit={handleSubmit} className="grid gap-6 bg-slate-800/20 border border-slate-700/50 p-8 rounded-2xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Email Address</label>
              <input
                name="email"
                value={formData.email}
                disabled
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Department</label>
              <select
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="MECH">Mechanical</option>
                <option value="EE">Electrical</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Current CGPA</label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                placeholder="e.g. 8.50"
                min= '0.00'
                max='10.00'
                value={formData.cgpa}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Phone Number</label>
              <input
                name="phone"
                type="tel"
                placeholder="+91 00000 00000"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Graduation Year</label>
              <input
                name="gradYear"
                type="number"
                placeholder="2025"
                min='0000'
                value={formData.gradYear}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Professional Bio</label>
            <textarea
              name="bio"
              rows="4"
              placeholder="Tell companies about your skills and career goals..."
              value={formData.bio}
              onChange={handleChange}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-teal-600/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default ProfilePage