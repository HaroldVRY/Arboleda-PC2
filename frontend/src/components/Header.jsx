import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function Header() {
  const { usuario, logout } = useContext(AuthContext)
  return (
    <header className="header">
      <div className="brand">Banco Arboleda</div>
      <div className="actions">
        {usuario ? (
          <>
            <span className="user">{usuario.nombre}</span>
            <button className="btn" onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <span />
        )}
      </div>
    </header>
  )
}
