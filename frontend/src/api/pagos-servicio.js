import api from './client'

export async function crearPago(data) {
  const res = await api.post('/pagos-servicio', data)
  return res.data
}
