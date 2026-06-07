import api from './client'
export async function listOperadores() { const res = await api.get('/operadores'); return res.data }
