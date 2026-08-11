<template>
  <div class="min-h-screen bg-gray-50 flex">
    <Sidebar />
    <ToastNotification />

    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <Navbar />

      <main class="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import Footer from '../components/layout/Footer.vue'
import ToastNotification from '../components/ui/ToastNotification.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()

let totalMensajesPrevios = 0
let intervaloGlobal = null

const verificarMensajesNuevosGlobal = async () => {
  const miEmail = (authStore.usuario?.correo || authStore.usuario?.email || 'admin@pulso.com').toLowerCase().trim()
  try {
    const res = await api.get('/chat/contactos')
    const contactos = res.data || []
    if (contactos.length > 0) {
      const primerContacto = contactos[0]
      const destEmail = (primerContacto.email || primerContacto.correo || '').toLowerCase().trim()
      const resMsg = await api.get(`/chat/conversacion/${destEmail}`)
      const mensajes = resMsg.data || []
      
      if (totalMensajesPrevios > 0 && mensajes.length > totalMensajesPrevios) {
        const ultimo = mensajes[mensajes.length - 1]
        if ((ultimo.remitente_email || '').toLowerCase().trim() !== miEmail) {
          uiStore.mostrarToast(`💬 Nuevo mensaje de ${ultimo.remitente || 'Contacto'}`, 'alerta')
        }
      }
      totalMensajesPrevios = mensajes.length
    }
  } catch (e) {}
}

onMounted(() => {
  verificarMensajesNuevosGlobal()
  intervaloGlobal = setInterval(verificarMensajesNuevosGlobal, 5000)
})

onUnmounted(() => {
  if (intervaloGlobal) clearInterval(intervaloGlobal)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>