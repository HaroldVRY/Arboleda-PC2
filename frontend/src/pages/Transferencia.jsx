import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StepIndicator from '../components/StepIndicator'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { listCuentas } from '../api/cuentas'
import { crearTransferencia } from '../api/transferencias'

const PASOS = ['Cuentas', 'Monto', 'Clave', 'Éxito']

function formatSaldo(saldo, moneda = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(saldo)
}

export default function Transferencia() {
  const navigate = useNavigate()

  const [paso, setPaso] = useState(1)

  // Paso 1
  const [cuentas, setCuentas] = useState([])
  const [cuentasLoading, setCuentasLoading] = useState(false)
  const [cuentasError, setCuentasError] = useState('')
  const [origenId, setOrigenId] = useState('')
  const [destinoId, setDestinoId] = useState('')
  const [cuentasSeleccionError, setCuentasSeleccionError] = useState('')

  // Paso 2
  const [monto, setMonto] = useState('')
  const [montoError, setMontoError] = useState('')

  // Paso 3
  const [claveOnline, setClaveOnline] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Paso 4
  const [mensajeExito, setMensajeExito] = useState('')

  useEffect(() => {
    if (paso !== 1 || cuentas.length > 0) return
    setCuentasLoading(true)
    setCuentasError('')
    listCuentas()
      .then((data) => setCuentas(data.cuentas))
      .catch(() => setCuentasError('No se pudieron cargar las cuentas.'))
      .finally(() => setCuentasLoading(false))
  }, [paso])

  // Si se cambia el origen y coincide con el destino, limpiar destino
  function handleOrigenChange(id) {
    setOrigenId(id)
    if (id === destinoId) setDestinoId('')
    setCuentasSeleccionError('')
  }

  function avanzar() {
    setSubmitError('')
    setPaso((p) => p + 1)
  }

  function retroceder() {
    setSubmitError('')
    setPaso((p) => p - 1)
  }

  function handlePaso1() {
    if (!origenId || !destinoId) {
      setCuentasSeleccionError('Debes seleccionar una cuenta de origen y una de destino.')
      return
    }
    if (origenId === destinoId) {
      setCuentasSeleccionError('Las cuentas de origen y destino deben ser distintas.')
      return
    }
    setCuentasSeleccionError('')
    avanzar()
  }

  function handlePaso2() {
    const n = Number(monto)
    if (!monto || !Number.isFinite(n) || n <= 0) {
      setMontoError('Ingresa un monto válido mayor a 0.')
      return
    }
    setMontoError('')
    avanzar()
  }

  async function handleConfirmar() {
    if (!claveOnline.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const data = await crearTransferencia({
        cuenta_origen_id: origenId,
        cuenta_destino_id: destinoId,
        monto: Number(monto),
        clave_online: claveOnline,
      })
      setMensajeExito(data.mensaje)
      setPaso(4)
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Error al procesar la transferencia.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const cuentaOrigen = cuentas.find((c) => c.id === origenId)
  const cuentaDestino = cuentas.find((c) => c.id === destinoId)
  const cuentasDestino = cuentas.filter((c) => c.id !== origenId)

  return (
    <Layout>
      <div className="page-header">
        <h1>Transferencia entre mis cuentas</h1>
      </div>

      <StepIndicator steps={PASOS} current={paso} />

      {/* ── PASO 1: Seleccionar cuentas ── */}
      {paso === 1 && (
        <div className="card" style={{ maxWidth: 520 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 1 — Selecciona las cuentas
          </h2>
          {cuentasError && <Alert type="error">{cuentasError}</Alert>}
          {cuentasSeleccionError && <Alert type="error">{cuentasSeleccionError}</Alert>}
          {cuentasLoading ? (
            <p className="text-muted">Cargando cuentas…</p>
          ) : (
            <>
              <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 10 }}>
                Cuenta de origen
              </label>
              <div className="chip-grid" style={{ flexDirection: 'column', marginBottom: 24 }}>
                {cuentas.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`chip-btn${origenId === c.id ? ' selected' : ''}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => handleOrigenChange(c.id)}
                  >
                    <span>{c.alias || c.numero_cuenta}</span>
                    <span style={{ fontSize: 13, color: origenId === c.id ? 'inherit' : '#6b7280' }}>
                      {formatSaldo(c.saldo, c.moneda)}
                    </span>
                  </button>
                ))}
              </div>

              <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 10 }}>
                Cuenta de destino
              </label>
              {origenId ? (
                <div className="chip-grid" style={{ flexDirection: 'column' }}>
                  {cuentasDestino.length === 0 ? (
                    <p className="text-muted">No hay otras cuentas disponibles.</p>
                  ) : (
                    cuentasDestino.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`chip-btn${destinoId === c.id ? ' selected' : ''}`}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onClick={() => { setDestinoId(c.id); setCuentasSeleccionError('') }}
                      >
                        <span>{c.alias || c.numero_cuenta}</span>
                        <span style={{ fontSize: 13, color: destinoId === c.id ? 'inherit' : '#6b7280' }}>
                          {formatSaldo(c.saldo, c.moneda)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-muted">Primero selecciona la cuenta de origen.</p>
              )}
            </>
          )}
          <div className="step-actions">
            <Button
              variant="primary"
              onClick={handlePaso1}
              disabled={!origenId || !destinoId}
              full
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 2: Monto ── */}
      {paso === 2 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 2 — Monto a transferir
          </h2>
          <div className="summary-box" style={{ marginBottom: 20 }}>
            <div className="summary-row">
              <span>Origen</span>
              <span>{cuentaOrigen?.alias || cuentaOrigen?.numero_cuenta}</span>
            </div>
            <div className="summary-row">
              <span>Saldo disponible</span>
              <span>{formatSaldo(cuentaOrigen?.saldo, cuentaOrigen?.moneda)}</span>
            </div>
            <div className="summary-row">
              <span>Destino</span>
              <span>{cuentaDestino?.alias || cuentaDestino?.numero_cuenta}</span>
            </div>
          </div>
          <Input
            id="monto"
            label="Monto (S/)"
            type="number"
            min="0.01"
            step="0.01"
            value={monto}
            onChange={(e) => { setMonto(e.target.value); setMontoError('') }}
            placeholder="0.00"
            error={montoError}
          />
          <div className="step-actions">
            <Button variant="outline" onClick={retroceder}>Atrás</Button>
            <Button
              variant="primary"
              onClick={handlePaso2}
              disabled={!monto || Number(monto) <= 0}
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
              <span>Origen</span>
              <span>{cuentaOrigen?.alias || cuentaOrigen?.numero_cuenta}</span>
            </div>
            <div className="summary-row">
              <span>Destino</span>
              <span>{cuentaDestino?.alias || cuentaDestino?.numero_cuenta}</span>
            </div>
            <div className="summary-row">
              <span>Monto</span>
              <span>S/ {Number(monto).toFixed(2)}</span>
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
              {submitting ? 'Procesando…' : 'Confirmar transferencia'}
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 4: Éxito ── */}
      {paso === 4 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h2>{mensajeExito || 'Transferencia realizada con éxito.'}</h2>
            <Button variant="primary" onClick={() => navigate('/principal')}>
              Volver al inicio
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}
