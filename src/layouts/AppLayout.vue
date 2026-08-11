<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar Fija (256px de ancho) -->
    <Sidebar />

    <!-- Área de Contenido Principal -->
    <div class="pl-64 flex flex-col flex-1 min-h-screen min-w-0">
      <!-- Navbar Superior Integrada al Flujo Vertical -->
      <Navbar class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs" />

      <!-- Contenido de las Vistas (Inicia justo debajo de la Navbar) -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>

      <Footer />
    </div>

    <!-- Notificaciones Toast Flotantes -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import { useUiStore } from '@/stores/ui'
import api from '@/services/api'

const uiStore = useUiStore()

// Verificación automática de tomas próximas al ingresar al sistema
const verificarNotificacionesMedicamentos = async () => {
  try {
    const res = await api.get('/medicamentos')
    const medicamentos = res.data?.data || res.data || []
    if (!Array.isArray(medicamentos) || medicamentos.length === 0) return

    const ahora = new Date()
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
    const diaHoy = diasSemana[ahora.getDay()]
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()

    medicamentos.forEach(med => {
      const diasNorm = (med.dias || []).map(d => String(d).toLowerCase())
      const aplicaHoy = diasNorm.length === 0 || diasNorm.includes(diaHoy) || diasNorm.includes('diario') || diasNorm.includes('todos')

      if (aplicaHoy && Array.isArray(med.horas)) {
        med.horas.forEach(horaStr => {
          const [h, m] = String(horaStr).split(':').map(Number)
          if (!isNaN(h) && !isNaN(m)) {
            const minutosHora = h * 60 + m
            const dif = minutosHora - minutosAhora

            // Alerta Roja: Menos de 30 minutos
            if (dif >= 0 && dif <= 30) {
              uiStore.addToast({
                tipo: 'error',
                titulo: '⚠️ ¡Alerta Próxima Toma!',
                mensaje: `${med.nombre} ${med.dosis || ''} a las ${horaStr} (${dif === 0 ? '¡Es hora!' : 'en ' + dif + ' min'})`
              })
            } 
            // Aviso Amarillo: Menos de 60 minutos
            else if (dif > 30 && dif <= 60) {
              uiStore.addToast({
                tipo: 'warning',
                titulo: '🔔 Recordatorio de Medicamento',
                mensaje: `${med.nombre} ${med.dosis || ''} a las ${horaStr} (en ${dif} min)`
              })
            }
          }
        })
      }
    })
  } catch (error) {
    // Modo silencioso
  }
}

onMounted(() => {
  verificarNotificacionesMedicamentos()
})
</script>