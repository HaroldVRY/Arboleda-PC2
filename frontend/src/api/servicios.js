import api from './client'
export async function listServicios() { const res = await api.get('/servicios'); return res.data }
