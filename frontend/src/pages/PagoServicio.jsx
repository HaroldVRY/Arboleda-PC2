import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StepIndicator from '../components/StepIndicator'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { listServicios } from '../api/servicios'
import { listCuentas } from '../api/cuentas'
import { crearPago } from '../api/pagos-servicio'

const PASOS = ['Servicio', 'Detalle', 'Clave', 'Éxito']

function formatSaldo(saldo, moneda = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(saldo)
}

export default function PagoServicio() {
  const navigate = useNavigate()

  const [paso, setPaso] = useState(1)

  // Paso 1
  const [servicios, setServicios] = useState([])
  const [serviciosLoading, setServiciosLoading] = useState(false)
  const [serviciosError, setServiciosError] = useState('')
  const [servicioId, setServicioId] = useState(null)

  // Paso 2
  const [codigoReferencia, setCodigoReferencia] = useState('')
  const [codigoError, setCodigoError] = useState('')
  const [monto, setMonto] = useState('')
  const [montoError, setMontoError] = useState('')
  const [cuentas, setCuentas] = useState([])
  const [cuentasLoading, setCuentasLoading] = useState(false)
  const [cuentasError, setCuentasError] = useState('')
  const [cuentaId, setCuentaId] = useState('')

  // Paso 3
  const [claveOnline, setClaveOnline] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Paso 4
  const [mensajeExito, setMensajeExito] = useState('')

  useEffect(() => {
    if (paso !== 1 || servicios.length > 0) return
    setServiciosLoading(true)
    setServiciosError('')
    listServicios()
      .then((data) => setServicios(data.servicios))
      .catch(() => setServiciosError('No se pudieron cargar los servicios.'))
      .finally(() => setServiciosLoading(false))
  }, [paso])

  useEffect(() => {
    if (paso !== 2 || cuentas.length > 0) return
    setCuentasLoading(true)
    setCuentasError('')
    listCuentas()
      .then((data) => {
        setCuentas(data.cuentas)
        if (data.cuentas.length === 1) setCuentaId(data.cuentas[0].id)
      })
      .catch(() => setCuentasError('No se pudieron cargar las cuentas.'))
      .finally(() => setCuentasLoading(false))
  }, [paso])

  function avanzar() {
    setSubmitError('')
    setPaso((p) => p + 1)
  }

  function retroceder() {
    setSubmitError('')
    setPaso((p) => p - 1)
  }

  function handlePaso1() {
    if (!servicioId) return
    avanzar()
  }

  function handlePaso2() {
    let ok = true
    if (!codigoReferencia.trim()) {
      setCodigoError('El código de referencia es obligatorio.')
      ok = false
    } else {
      setCodigoError('')
    }
    const n = Number(monto)
    if (!monto || !Number.isFinite(n) || n <= 0) {
      setMontoError('Ingresa un monto válido mayor a 0.')
      ok = false
    } else {
      setMontoError('')
    }
    if (!cuentaId || !ok) return
    avanzar()
  }

  async function handleConfirmar() {
    if (!claveOnline.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const data = await crearPago({
        servicio_id: servicioId,
        codigo_referencia: codigoReferencia,
        monto: Number(monto),
        clave_online: claveOnline,
        cuenta_id: cuentaId,
      })
      setMensajeExito(data.mensaje)
      setPaso(4)
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Error al procesar el pago.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const servicioSeleccionado = servicios.find((s) => s.id === servicioId)
  const cuentaSeleccionada = cuentas.find((c) => c.id === cuentaId)

  // Agrupar servicios por categoría para mejor lectura
  const porCategoria = servicios.reduce((acc, s) => {
    if (!acc[s.categoria]) acc[s.categoria] = []
    acc[s.categoria].push(s)
    return acc
  }, {})

  return (
    <Layout>
      <div className="page-header">
        <h1>Pago de Servicio</h1>
      </div>

      <StepIndicator steps={PASOS} current={paso} />

      {/* ── PASO 1: Seleccionar servicio ── */}
      {paso === 1 && (
        <div className="card" style={{ maxWidth: 520 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 1 — Selecciona el servicio
          </h2>
          {serviciosError && <Alert type="error">{serviciosError}</Alert>}
          {serviciosLoading ? (
            <p className="text-muted">Cargando servicios…</p>
          ) : (
            Object.entries(porCategoria).map(([categoria, lista]) => (
              <div key={categoria} style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#6b7280',
                    marginBottom: 8,
                  }}
                >
                  {categoria}
                </p>
                <div className="chip-grid">
                  {lista.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`chip-btn${servicioId === s.id ? ' selected' : ''}`}
                      onClick={() => setServicioId(s.id)}
                    >
                      {s.nombre}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
          <div className="step-actions">
            <Button variant="primary" onClick={handlePaso1} disabled={!servicioId} full>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 2: Código, monto y cuenta ── */}
      {paso === 2 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 2 — Código de referencia, monto y cuenta
          </h2>

          <Input
            id="codigo"
            label="Código de referencia"
            type="text"
            value={codigoReferencia}
            onChange={(e) => { setCodigoReferencia(e.target.value); setCodigoError('') }}
            placeholder="Ej. 123456789"
            error={codigoError}
          />

          <Input
            id="monto"
            label="Monto (S/)"
            type="number"
            min="1"
            step="0.01"
            value={monto}
            onChange={(e) => { setMonto(e.target.value); setMontoError('') }}
            placeholder="0.00"
            error={montoError}
          />

          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', margin: '4px 0 10px' }}>
            Cuenta de cargo
          </label>
          {cuentasError && <Alert type="error">{cuentasError}</Alert>}
          {cuentasLoading ? (
            <p className="text-muted">Cargando cuentas…</p>
          ) : (
            <div className="chip-grid" style={{ flexDirection: 'column' }}>
              {cuentas.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`chip-btn${cuentaId === c.id ? ' selected' : ''}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => setCuentaId(c.id)}
                >
                  <span>{c.alias || c.numero_cuenta}</span>
                  <span style={{ fontSize: 13, color: cuentaId === c.id ? 'inherit' : '#6b7280' }}>
                    {formatSaldo(c.saldo, c.moneda)}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="step-actions">
            <Button variant="outline" onClick={retroceder}>Atrás</Button>
            <Button
              variant="primary"
              onClick={handlePaso2}
              disabled={!codigoReferencia.trim() || !monto || !cuentaId}
              full
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 3: Clave online ── */}
      {paso === 3 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 3 — Confirmar con clave online
          </h2>

          <div className="summary-box">
            <div className="summary-row">
              <span>Servicio</span>
              <span>{servicioSeleccionado?.nombre}</span>
            </div>
            <div className="summary-row">
              <span>Referencia</span>
              <span>{codigoReferencia}</span>
            </div>
            <div className="summary-row">
              <span>Monto</span>
              <span>S/ {Number(monto).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Cuenta</span>
              <span>{cuentaSeleccionada?.alias || cuentaSeleccionada?.numero_cuenta}</span>
            </div>
          </div>

          {submitError && <Alert type="error">{submitError}</Alert>}

          <Input
            id="clave-online"
            label="Clave online"
            type="password"
            value={claveOnline}
            onChange={(e) => setClaveOnline(e.target.value)}
            placeholder="••••••"
            autoComplete="current-password"
          />

          <div className="step-actions">
            <Button variant="outline" onClick={retroceder} disabled={submitting}>Atrás</Button>
            <Button
              variant="primary"
              onClick={handleConfirmar}
              disabled={!claveOnline.trim() || submitting}
              full
            >
              {submitting ? 'Procesando…' : 'Confirmar pago'}
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 4: Éxito ── */}
      {paso === 4 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h2>{mensajeExito || 'Pago realizado con éxito.'}</h2>
            <Button variant="primary" onClick={() => navigate('/principal')}>
              Volver al inicio
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}
