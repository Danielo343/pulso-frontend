<template>
  <header class="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 flex items-center justify-between px-4 lg:px-8">
    <div class="flex items-center space-x-4">
      <button @click="uiStore.toggleSidebar" class="lg:hidden text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-gray-800">Monitoreo de Salud</h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Información del Usuario -->
      <div class="flex items-center space-x-3">
        <img
          :src="usuarioAvatar"
          alt="Avatar"
          class="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <div class="hidden sm:block text-left">
          <p class="text-sm font-medium text-gray-800">{{ usuarioNombre }}</p>
          <p class="text-xs text-gray-500">{{ usuarioCorreo }}</p>
        </div>
      </div>

      <!-- Botón Cerrar Sesión -->
      <button
        @click="handleLogout"
        class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Cerrar sesión"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

// Propiedades computadas con valores por defecto seguros
const usuarioNombre = computed(() => {
  return authStore.usuario?.nombre || authStore.usuario?.name || 'Usuario Pulso'
})

const usuarioCorreo = computed(() => {
  return authStore.usuario?.correo || authStore.usuario?.email || 'admin@pulso.com'
})

const usuarioAvatar = computed(() => {
  return authStore.usuario?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioNombre.value)}&background=0D8ABC&color=fff`
})

const handleLogout = async () => {
  await authStore.cerrarSesion()
  router.push('/login')
}
</script>