import api from './client'

export async function crearRecarga(data) {
  const res = await api.post('/recargas', data)
  return res.data
}
