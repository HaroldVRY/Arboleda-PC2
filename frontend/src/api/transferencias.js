import api from './client'

export async function crearTransferencia(data) {
  const res = await api.post('/transferencias', data)
  return res.data
}
