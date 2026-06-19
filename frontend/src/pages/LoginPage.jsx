import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import AuthLayout from '../components/AuthLayout'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (formData) => {
    await login(formData)
    navigate('/user/dashboard')
  }

  return (
    <AuthLayout mode="login" onModeChange={() => navigate('/register')}>
      <AuthForm mode="login" onSubmit={handleLogin} />
    </AuthLayout>
  )
}

export default LoginPage
