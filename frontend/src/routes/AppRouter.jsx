import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Login from '../pages/Login'
import Principal from '../pages/Principal'
import Recarga from '../pages/Recarga'
import PagoServicio from '../pages/PagoServicio'
import Transferencia from '../pages/Transferencia'

function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext)
  if (loading) return null // espera la re-hidratación del token antes de redirigir
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/principal" element={<PrivateRoute><Principal /></PrivateRoute>} />
      <Route path="/recarga" element={<PrivateRoute><Recarga /></PrivateRoute>} />
      <Route path="/pago-servicio" element={<PrivateRoute><PagoServicio /></PrivateRoute>} />
      <Route path="/transferencia" element={<PrivateRoute><Transferencia /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
