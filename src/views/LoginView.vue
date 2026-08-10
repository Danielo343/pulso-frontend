<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
      <p class="text-sm text-gray-600 mt-1">
        Inicia sesión para continuar el monitoreo de tus pacientes.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Alerta de error -->
      <div v-if="authStore.error" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
        {{ authStore.error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="admin@pulso.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="••••••••"
        />
      </div>

      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center">
          <input v-model="form.remember" type="checkbox" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="ml-2 text-gray-600">Recordarme</span>
        </label>
        <a href="#" class="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
      </div>

      <button
        type="submit"
        :disabled="authStore.cargando"
        class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-150 flex items-center justify-center disabled:opacity-50"
      >
        <span v-if="authStore.cargando">Iniciando sesión...</span>
        <span v-else>Iniciar sesión</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: 'admin@pulso.com',
  password: 'password123',
  remember: false
})

const handleSubmit = async () => {
  try {
    await authStore.iniciarSesion({
      email: form.value.email,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch (err) {
    console.error('Error al iniciar sesión:', err)
  }
}
</script>