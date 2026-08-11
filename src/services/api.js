import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_acceso')
  const usuarioRaw = localStorage.getItem('usuario')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  if (usuarioRaw) {
    try {
      const u = JSON.parse(usuarioRaw)
      const email = u?.email || u?.correo
      if (email) {
        config.headers['X-User-Email'] = email
      }
    } catch (e) {}
  }
  
  return config
})

export default api