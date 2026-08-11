import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarAbierto: false,
    toast: {
      visible: false,
      mensaje: '',
      tipo: 'exito' // 'exito' | 'error' | 'alerta'
    }
  }),

  actions: {
    toggleSidebar() {
      this.sidebarAbierto = !this.sidebarAbierto
    },
    mostrarToast(mensaje, tipo = 'exito') {
      this.toast.mensaje = mensaje
      this.toast.tipo = tipo
      this.toast.visible = true

      setTimeout(() => {
        this.toast.visible = false
      }, 4000)
    },
    ocultarToast() {
      this.toast.visible = false
    }
  }
})