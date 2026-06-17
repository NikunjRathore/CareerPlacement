import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import JobListingPage from './pages/JobListingPage'
import ProfilePage from './pages/ProfilePage'
import { JobLayout } from './context/JobContext'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AddJob from './pages/Admin/AddJob'
import ErrorPage from './pages/ErrorPage'
import AddCompany from './pages/Admin/AddCompany'


function AppRoutes() {
  const { token } = useAuth()

  return (
    <Routes>
      {token ? (
        <>
            <Route path="/user/dashboard" element={<DashboardPage />} />
            <Route element={<JobLayout />}>
              <Route path="/user/jobs" element={<JobListingPage />} />
            </Route>
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="add_job" element={<AddJob />} />
              <Route path="add_company" element={<AddCompany />} />
            </Route>
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