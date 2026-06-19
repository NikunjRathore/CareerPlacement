import { useState } from 'react'
import TextInput from './TextInput'

function AuthForm({ mode, onSubmit }) {
  const isLogin = mode === 'login'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage({ type: '', text: '' })
    setSubmitting(true)

    try {
      await onSubmit(formData)
      setMessage({ 
        type: 'success', 
        text: isLogin ? 'Login successful! Redirecting...' : 'Account created successfully! Redirecting to login...' 
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Something went wrong. Please try again.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-300/40 ring-1 ring-slate-900/5 backdrop-blur transition duration-300 hover:shadow-2xl hover:shadow-slate-300/60"
    >
      {!isLogin && (
        <TextInput
          label="Full name"
          name="name"
          onChange={updateField}
          placeholder="John Doe"
          required
          type="text"
          value={formData.name}
        />
      )}

      <TextInput
        label="Email address"
        name="email"
        onChange={updateField}
        placeholder="you@example.com"
        required
        type="email"
        value={formData.email}
      />

      <TextInput
        label="Password"
        minLength={6}
        name="password"
        onChange={updateField}
        placeholder="At least 6 characters"
        required
        type="password"
        value={formData.password}
      />

      {message.text && (
        <div className={`rounded-lg border px-4 py-3 text-sm font-medium transition duration-200 ${
          message.type === 'error'
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-teal-200 bg-teal-50 text-teal-700'
        }`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="group relative h-12 rounded-lg bg-linear-to-r from-teal-600 to-teal-700 px-5 text-base font-semibold text-white shadow-lg shadow-teal-600/25 transition duration-200 hover:shadow-xl hover:shadow-teal-600/40 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none"
      >
        <span className={submitting ? 'opacity-0' : 'opacity-100'}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </span>
        {submitting && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          </span>
        )}
      </button>
    </form>
  )
}

export default AuthForm
