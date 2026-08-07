import axios from 'axios'

/**
 * Instancia base de Axios.
 * Este archivo se deja preparado para conectarse en el futuro
 * con la API REST del backend en Laravel.
 *
 * No se realiza ninguna petición real en esta versión del frontend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Interceptor de ejemplo, listo para adjuntar el token de autenticación
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('pulso_token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
