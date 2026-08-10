import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token_acceso') || null,
    cargando: false,
    error: null
  }),

  getters: {
    estaAutenticado: (state) => !!state.token
  },

  actions: {
    async iniciarSesion(credenciales) {
      this.cargando = true
      this.error = null
      try {
        const respuesta = await api.post('/iniciar-sesion', credenciales)
        this.token = respuesta.data.token_acceso
        this.usuario = respuesta.data.usuario

        localStorage.setItem('token_acceso', this.token)
        localStorage.setItem('usuario', JSON.stringify(this.usuario))

        return respuesta.data
      } catch (err) {
        this.error = err.response?.data?.mensaje || 'Error al iniciar sesión'
        throw this.error
      } finally {
        this.cargando = false
      }
    },

    async cerrarSesion() {
      try {
        await api.post('/cerrar-sesion')
      } catch (err) {
        console.error('Error al cerrar sesión:', err)
      } finally {
        this.token = null
        this.usuario = null
        localStorage.removeItem('token_acceso')
        localStorage.removeItem('usuario')
      }
    }
  }
})