import { defineStore } from 'pinia'

/**
 * Store de autenticación (placeholder).
 * Almacena únicamente datos de ejemplo para maquetar la interfaz.
 * La lógica real de autenticación se conectará posteriormente
 * con la API REST de Laravel.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      name: 'Dra. Camila Reyes',
      role: 'Cuidadora principal',
      email: 'camila.reyes@pulso.app',
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    isAuthenticated: true // valor de ejemplo, sin lógica real
  }),
  actions: {
    // Métodos vacíos, listos para integrarse con la API más adelante
    login() {},
    logout() {}
  }
})
