import api from './client'
export async function listCuentas() { const res = await api.get('/cuentas'); return res.data }
