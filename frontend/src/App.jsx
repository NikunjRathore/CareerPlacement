import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import JobListingPage from './pages/JobListingPage'
import ProfilePage from './pages/ProfilePage'
import { JobLayout } from './context/JobContext'

function AppRoutes() {
  const { token } = useAuth()

  return (
    <Routes>
      {token ? (
        <>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route element={<JobLayout />}>
            <Route path="/jobs" element={<JobListingPage />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </>
      )}
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App