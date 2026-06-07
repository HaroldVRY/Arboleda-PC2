import React, { createContext, useState, useEffect } from 'react'
import { me } from '../api/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(null)
  // Si ya hay un token guardado hay que re-hidratar el usuario antes de renderizar rutas
  const [loading, setLoading] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    me()
      .then((data) => setUsuario(data.usuario))
      .catch(() => {
        // Token inválido o expirado
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, []) // solo al montar

  function login(data) {
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUsuario(data.usuario)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ token, usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
