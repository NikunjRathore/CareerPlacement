/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile, login as loginRequest, register as registerRequest } from '../api/authApi'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    let isActive = true

    const validateToken = async () => {
      if (!token) {
        localStorage.removeItem('user')
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const data = await getProfile(token)
        if (!isActive) return

        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
      } catch {
        if (!isActive) return

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        if (isActive) setLoading(false)
      }
    }

    validateToken()

    return () => {
      isActive = false
    }
  }, [token])

  const login = async (formData) => {
    const data = await loginRequest(formData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (formData) => {
    await registerRequest(formData)
  }

  const logout = () => {
    clearSession()
  }

  const updateProfileState = (updatedUser) => {
    if (!updatedUser) {
      setUser(null)
      localStorage.removeItem('user')
      return
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }


  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfileState,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
