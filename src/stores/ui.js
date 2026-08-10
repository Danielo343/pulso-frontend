import { defineStore } from 'pinia'

/**
 * Store de interfaz general.
 * Controla el estado visual de la aplicación (sidebar, tema, etc).
 * No contiene lógica de negocio ni llamadas a servicios externos.
 */
export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: false, // estado del sidebar en móvil
    sidebarCollapsed: false // estado colapsado en escritorio
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    closeSidebar() {
      this.sidebarOpen = false
    },
    toggleCollapsed() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    }
  }
})
