import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </AuthProvider>
  )
}
