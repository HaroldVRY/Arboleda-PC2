import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import AuthContext from '../context/AuthContext'
import Alert from '../components/Alert'
import { listCuentas } from '../api/cuentas'

const OPCIONES = [
  {
    to: '/recarga',
    label: 'Recarga celular',
    desc: 'Recarga tu celular al instante',
    color: '#1a3a6b',
  },
  {
    to: '/pago-servicio',
    label: 'Pago de Servicio',
    desc: 'Paga tus servicios del hogar',
    color: '#2756a8',
  },
  {
    to: '/transferencia',
    label: 'Transferencia entre mis cuentas',
    desc: 'Mueve dinero entre tus cuentas',
    color: '#c9a227',
  },
]

function formatSaldo(saldo, moneda = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(saldo)
}

export default function Principal() {
  const { usuario } = useContext(AuthContext)
  const [cuentas, setCuentas] = useState([])
  const [cuentasError, setCuentasError] = useState('')

  useEffect(() => {
    listCuentas()
      .then((data) => setCuentas(data.cuentas))
      .catch(() => setCuentasError('No se pudieron cargar las cuentas.'))
  }, [])

  return (
    <Layout>
      <div className="page-header">
        <h1 style={{ marginBottom: '4px' }}>Hola, {usuario?.nombre}</h1>
        <p>¿Qué deseas hacer hoy?</p>
      </div>

      <div className="card-grid" style={{ marginBottom: '40px' }}>
        {OPCIONES.map(({ to, label, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="option-card"
            style={{ borderTop: `4px solid ${color}` }}
          >
            <span className="label" style={{ color }}>{label}</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{desc}</span>
          </Link>
        ))}
      </div>

      <h2
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--primary)',
          margin: '0 0 16px',
        }}
      >
        Mis cuentas
      </h2>

      {cuentasError && <Alert type="error">{cuentasError}</Alert>}

      <div className="card-grid">
        {cuentas.map((c) => (
          <div key={c.id} className="card">
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
              {c.alias || c.numero_cuenta}
            </div>
            <div className="saldo">{formatSaldo(c.saldo, c.moneda)}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
              N.° {c.numero_cuenta}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
