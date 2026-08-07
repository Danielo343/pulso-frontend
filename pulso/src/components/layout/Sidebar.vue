<script setup>
import { RouterLink } from 'vue-router'
import NavIcon from '@/components/common/NavIcon.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const navItems = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Usuarios', to: '/usuarios', icon: 'usuarios' },
  { label: 'Dispositivos', to: '/dispositivos', icon: 'dispositivos' },
  { label: 'Mediciones', to: '/mediciones', icon: 'mediciones' },
  { label: 'Medicamentos', to: '/medicamentos', icon: 'medicamentos' },
  { label: 'Historial Médico', to: '/historial-medico', icon: 'historial' },
  { label: 'Contactos de Emergencia', to: '/contactos', icon: 'contactos' },
  { label: 'Eventos', to: '/eventos', icon: 'eventos' },
  { label: 'Notificaciones', to: '/notificaciones', icon: 'notificaciones' },
  { label: 'Archivos Médicos', to: '/archivos-medicos', icon: 'archivos' },
  { label: 'Recetas Médicas', to: '/recetas', icon: 'recetas' },
  { label: 'Reportes', to: '/reportes', icon: 'reportes' },
  { label: 'Configuración', to: '/configuracion', icon: 'configuracion' }
]
</script>

<template>
  <!-- Overlay móvil -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="ui.sidebarOpen"
      class="fixed inset-0 bg-ink-900/40 z-30 lg:hidden"
      @click="ui.closeSidebar()"
    />
  </Transition>

  <aside
    class="fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-ink-200/70 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0"
    :class="ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center gap-3 px-6 border-b border-ink-200/70 flex-shrink-0">
      <div class="relative h-9 w-9 flex items-center justify-center rounded-xl bg-primary-600">
        <span class="absolute inset-0 rounded-xl bg-primary-500 animate-pulse-ring"></span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12h4l1.5-4L12 18l2-9 1.5 3H22" />
        </svg>
      </div>
      <div>
        <p class="font-display font-extrabold text-lg text-ink-900 leading-none">Pulso</p>
        <p class="text-[11px] text-ink-400 mt-0.5">Monitoreo de salud</p>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
        active-class="!bg-primary-600 !text-white shadow-sm shadow-primary-600/20"
        @click="ui.closeSidebar()"
      >
        <NavIcon :name="item.icon" class="flex-shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Estado del sistema -->
    <div class="p-4 border-t border-ink-200/70 flex-shrink-0">
      <div class="flex items-center gap-3 rounded-xl bg-accent-50 px-3 py-3">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-500"></span>
        </span>
        <div class="text-xs">
          <p class="font-semibold text-accent-700">Todos los dispositivos activos</p>
          <p class="text-accent-600/80">Última sincronización: hace 2 min</p>
        </div>
      </div>
    </div>
  </aside>
</template>
