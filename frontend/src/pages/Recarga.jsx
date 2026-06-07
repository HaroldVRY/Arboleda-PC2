import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StepIndicator from '../components/StepIndicator'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { listOperadores } from '../api/operadores'
import { listCuentas } from '../api/cuentas'
import { crearRecarga } from '../api/recargas'

const PASOS = ['Número', 'Operador', 'Monto', 'Confirmación', 'Éxito']
const MONTOS_RAPIDOS = [10, 20, 30, 50]

function formatSaldo(saldo, moneda = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(saldo)
}

export default function Recarga() {
  const navigate = useNavigate()

  const [paso, setPaso] = useState(1)

  // Paso 1
  const [numeroCelular, setNumeroCelular] = useState('')
  const [numError, setNumError] = useState('')

  // Paso 2
  const [operadores, setOperadores] = useState([])
  const [opLoading, setOpLoading] = useState(false)
  const [opError, setOpError] = useState('')
  const [operadorId, setOperadorId] = useState(null)

  // Paso 3
  const [montoRapido, setMontoRapido] = useState(null)
  const [montoCustom, setMontoCustom] = useState('')
  const [cuentas, setCuentas] = useState([])
  const [cuentasLoading, setCuentasLoading] = useState(false)
  const [cuentasError, setCuentasError] = useState('')
  const [cuentaId, setCuentaId] = useState('')

  // Paso 4
  const [claveOnline, setClaveOnline] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Paso 5
  const [mensajeExito, setMensajeExito] = useState('')

  // Derivado: monto final a enviar
  const montoFinal = montoRapido !== null ? String(montoRapido) : montoCustom

  // Cargar operadores al llegar al paso 2
  useEffect(() => {
    if (paso !== 2 || operadores.length > 0) return
    setOpLoading(true)
    setOpError('')
    listOperadores()
      .then((data) => setOperadores(data.operadores))
      .catch(() => setOpError('No se pudieron cargar los operadores.'))
      .finally(() => setOpLoading(false))
  }, [paso])

  // Cargar cuentas al llegar al paso 3
  useEffect(() => {
    if (paso !== 3 || cuentas.length > 0) return
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

  // ── Validación y avance por paso ──

  function handlePaso1() {
    if (!/^\d{9}$/.test(numeroCelular)) {
      setNumError('Debe tener exactamente 9 dígitos numéricos.')
      return
    }
    setNumError('')
    avanzar()
  }

  function handlePaso2() {
    if (!operadorId) return
    avanzar()
  }

  function handlePaso3() {
    const n = Number(montoFinal)
    if (!montoFinal || !Number.isFinite(n) || n <= 0) return
    if (!cuentaId) return
    avanzar()
  }

  async function handleConfirmar() {
    if (!claveOnline.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const data = await crearRecarga({
        numero_celular: numeroCelular,
        operador_id: operadorId,
        monto: Number(montoFinal),
        clave_online: claveOnline,
        cuenta_id: cuentaId,
      })
      setMensajeExito(data.mensaje)
      setPaso(5)
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Error al procesar la recarga.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Datos para el resumen del paso 4
  const operadorNombre = operadores.find((o) => o.id === operadorId)?.nombre ?? ''
  const cuentaSeleccionada = cuentas.find((c) => c.id === cuentaId)

  return (
    <Layout>
      <div className="page-header">
        <h1>Recarga celular</h1>
      </div>

      <StepIndicator steps={PASOS} current={paso} />

      {/* ── PASO 1: Número de celular ── */}
      {paso === 1 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 1 — Número de celular
          </h2>
          <Input
            id="celular"
            label="Número de celular"
            type="tel"
            value={numeroCelular}
            onChange={(e) => {
              setNumeroCelular(e.target.value.replace(/\D/g, '').slice(0, 9))
              setNumError('')
            }}
            placeholder="9XXXXXXXX"
            maxLength={9}
            error={numError}
          />
          <div className="step-actions">
            <Button variant="primary" onClick={handlePaso1} full>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 2: Selección de operador ── */}
      {paso === 2 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 2 — Selecciona el operador
          </h2>
          {opError && <Alert type="error">{opError}</Alert>}
          {opLoading ? (
            <p className="text-muted">Cargando operadores…</p>
          ) : (
            <div className="chip-grid">
              {operadores.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  className={`chip-btn${operadorId === op.id ? ' selected' : ''}`}
                  onClick={() => setOperadorId(op.id)}
                >
                  {op.nombre}
                </button>
              ))}
            </div>
          )}
          <div className="step-actions">
            <Button variant="outline" onClick={retroceder}>
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handlePaso2}
              disabled={!operadorId}
              full
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 3: Monto y cuenta ── */}
      {paso === 3 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 3 — Monto y cuenta de cargo
          </h2>

          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 10 }}>
            Monto de recarga
          </label>
          <div className="chip-grid">
            {MONTOS_RAPIDOS.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`chip-btn${montoRapido === amt ? ' selected' : ''}`}
                onClick={() => {
                  setMontoRapido(amt)
                  setMontoCustom('')
                }}
              >
                S/ {amt}
              </button>
            ))}
          </div>

          <Input
            id="monto-custom"
            label="Otro monto (S/)"
            type="number"
            min="1"
            value={montoCustom}
            onChange={(e) => {
              setMontoCustom(e.target.value)
              setMontoRapido(null)
            }}
            placeholder="Ingresa un monto"
          />

          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', margin: '8px 0 10px' }}>
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
            <Button variant="outline" onClick={retroceder}>
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handlePaso3}
              disabled={!montoFinal || Number(montoFinal) <= 0 || !cuentaId}
              full
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 4: Clave online ── */}
      {paso === 4 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 17 }}>
            Paso 4 — Confirmar con clave online
          </h2>

          <div className="summary-box">
            <div className="summary-row">
              <span>Número</span>
              <span>{numeroCelular}</span>
            </div>
            <div className="summary-row">
              <span>Operador</span>
              <span>{operadorNombre}</span>
            </div>
            <div className="summary-row">
              <span>Monto</span>
              <span>S/ {Number(montoFinal).toFixed(2)}</span>
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
            <Button variant="outline" onClick={retroceder} disabled={submitting}>
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmar}
              disabled={!claveOnline.trim() || submitting}
              full
            >
              {submitting ? 'Procesando…' : 'Confirmar recarga'}
            </Button>
          </div>
        </div>
      )}

      {/* ── PASO 5: Éxito ── */}
      {paso === 5 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h2>{mensajeExito || 'Recarga realizada con éxito.'}</h2>
            <Button variant="primary" onClick={() => navigate('/principal')}>
              Volver al inicio
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}
