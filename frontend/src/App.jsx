import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
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
import AddNotification from './pages/Admin/AddNotification'
import CodingProfilePage from './pages/CodingProfilePage'
import ResumeUploadPage from './pages/ResumeUploadPage'
import ApplicationTrackerPage from './pages/ApplicationTrackerPage'
import PlacementReadinessPage from './pages/PlacementReadinessPage'
import CompanyTargetingPage from './pages/CompanyTargetingPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import PlacementStats from './pages/Admin/PlacementStats'
import StatsPage from './pages/StatsPage'
import { MockInterviewPage } from './pages/MockInterviewPage'


function AppRoutes() {
  const { token } = useAuth()
  // Simple route guard for authenticated users
  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />
    return children
  }

  // Admin guard: checks user role from localStorage (keeps it simple)
  const AdminRoute = ({ children }) => {
    
    const saved = localStorage.getItem('user')
    let user = null
    try {
      user = saved ? JSON.parse(saved) : null
    } catch (e) {
      user = null
    }

    if (!token) return <Navigate to="/login" replace />
    if (user.role !== 'admin') return <Navigate to="/user/dashboard" replace />
    return children
  }

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected user routes */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route element={<JobLayout />}>
                <Route path="jobs" element={<JobListingPage />} />
              </Route>
              <Route path="coding-profile" element={<CodingProfilePage />} />
              <Route path="resume" element={<ResumeUploadPage />} />
              <Route path="applications" element={<ApplicationTrackerPage />} />
              <Route path="readiness" element={<PlacementReadinessPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="company-targeting" element={<CompanyTargetingPage />} />
              <Route path="interview-prep" element={<InterviewPrepPage />} />
              <Route path="mock-interview" element={<MockInterviewPage />} />
              <Route path="" element={<Navigate to="/user/dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin routes - guarded by AdminRoute */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Routes>
              <Route path="" element={<AdminDashboard />} />
              <Route path="add_job" element={<AddJob />} />
              <Route path="add_company" element={<AddCompany />} />
              <Route path="add_notification" element={<AddNotification />} />
              <Route path="stats" element={<PlacementStats />} />
              <Route path="" element={<Navigate to="/admin" replace />} />
            </Routes>
          </AdminRoute>
        }
      />

      {/* Fallbacks */}
      <Route path="/" element={token ? <Navigate to="/user/dashboard" replace /> : <Navigate to="/register" replace />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App