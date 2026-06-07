import React, { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { login as apiLogin } from '../api/auth'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Login() {
  const { token, login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/principal" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      login(data)
      navigate('/principal', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || 'Error al iniciar sesión. Intenta de nuevo.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="bank-name">Banco Arboleda</div>
          <div className="subtitle">Banca en línea</div>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            required
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" variant="primary" full disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p
          style={{
            marginTop: '24px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.6',
          }}
        >
          <strong>Credenciales demo:</strong>
          <br />
          Email: <code style={{ fontSize: '12px' }}>cliente@arboleda.com</code>
          <br />
          Contraseña: <code style={{ fontSize: '12px' }}>Arboleda123</code>
        </p>
      </div>
    </div>
  )
}
