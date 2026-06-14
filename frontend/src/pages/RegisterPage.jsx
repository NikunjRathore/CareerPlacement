import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import AuthLayout from '../components/AuthLayout'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleRegister = async (formData) => {
    await register(formData)
    navigate('/login')
  }

  return (
    <AuthLayout mode="register" onModeChange={() => navigate('/login')}>
      <AuthForm mode="register" onSubmit={handleRegister} />
    </AuthLayout>
  )
}

export default RegisterPage
