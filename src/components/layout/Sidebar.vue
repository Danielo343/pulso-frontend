<template>
  <aside
    :class="`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
      uiStore.sidebarAbierto ? 'translate-x-0' : '-translate-x-full'
    }`"
  >
    <div class="h-16 flex items-center px-6 border-b border-gray-200 space-x-3">
      <img src="/pulso-icon.svg" alt="Pulso" class="w-8 h-8" />
      <div>
        <span class="font-bold text-xl text-blue-600 tracking-tight block">Pulso</span>
        <span class="text-[10px] text-gray-400 font-medium block -mt-1">Monitoreo de salud</span>
      </div>
    </div>

    <div class="px-4 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
      <p class="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        Rol Activo: {{ miRol }}
      </p>

      <nav class="space-y-1">
        <router-link to="/dashboard" class="item-link" active-class="item-link-active">
          <span>░░</span><span>Dashboard</span>
        </router-link>

        <!-- Exclusivo Administrador -->
        <router-link v-if="miRol === 'administrador'" to="/usuarios" class="item-link" active-class="item-link-active">
          <span>👥</span><span>Gestión Usuarios</span>
        </router-link>

        <!-- Exclusivo Administrador -->
        <router-link v-if="miRol === 'administrador'" to="/dispositivos" class="item-link" active-class="item-link-active">
          <span>📱</span><span>Dispositivos</span>
        </router-link>

        <router-link to="/mediciones" class="item-link" active-class="item-link-active">
          <span>📈</span><span>Mediciones</span>
        </router-link>

        <router-link to="/medicamentos" class="item-link" active-class="item-link-active">
          <span>💊</span><span>Medicamentos</span>
        </router-link>

        <router-link v-if="miRol === 'administrador' || miRol === 'paciente'" to="/historial-medico" class="item-link" active-class="item-link-active">
          <span>📋</span><span>Historial Médico</span>
        </router-link>

        <router-link to="/contactos" class="item-link" active-class="item-link-active">
          <span>📞</span><span>Contactos de Emergencia</span>
        </router-link>

        <router-link to="/eventos" class="item-link" active-class="item-link-active">
          <span>📅</span><span>Eventos</span>
        </router-link>

        <router-link to="/notificaciones" class="item-link" active-class="item-link-active">
          <span>🔔</span><span>Notificaciones</span>
        </router-link>

        <router-link to="/archivos-medicos" class="item-link" active-class="item-link-active">
          <span>📁</span><span>Archivos Médicos</span>
        </router-link>

        <router-link to="/recetas" class="item-link" active-class="item-link-active">
          <span>📑</span><span>Recetas Médicas</span>
        </router-link>

        <router-link to="/reportes" class="item-link" active-class="item-link-active">
          <span>📊</span><span>Reportes</span>
        </router-link>

        <router-link to="/configuracion" class="item-link" active-class="item-link-active">
          <span>⚙️</span><span>Configuración</span>
        </router-link>

        <router-link to="/chat" class="item-link" active-class="item-link-active">
          <span>💬</span><span>Chat Médico en Vivo</span>
        </router-link>
      </nav>
    </div>

    <div class="absolute bottom-4 left-4 right-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs">
      <div class="flex items-center space-x-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span class="font-bold text-green-800">Todos los dispositivos activos</span>
      </div>
      <p class="text-[10px] text-green-600 mt-0.5">Última sincronización: hace 2 min</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '../../stores/ui'
import { useAuthStore } from '../../stores/auth'

const uiStore = useUiStore()
const authStore = useAuthStore()

const miRol = computed(() => {
  const rol = authStore.usuario?.rol || authStore.usuario?.role
  return (rol || 'administrador').toLowerCase()
})
</script>

<style scoped>
.item-link {
  @apply flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition;
}
.item-link-active {
  @apply bg-blue-600 text-white font-bold shadow-sm hover:bg-blue-700;
}
</style>