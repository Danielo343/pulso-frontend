<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)

function handleLogin() {
  // Solo navegación de ejemplo, sin autenticación real
  router.push('/')
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-ink-900 mb-1">Bienvenido de nuevo</h1>
    <p class="text-sm text-ink-500 mb-8">Inicia sesión para continuar el monitoreo de tus pacientes.</p>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <Input v-model="email" type="email" label="Correo electrónico" placeholder="tucorreo@pulso.app">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0-.83.67-1.5 1.5-1.5h16.5c.83 0 1.5.67 1.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75zm1.5 0l8.25 6 8.25-6" />
          </svg>
        </template>
      </Input>

      <Input v-model="password" type="password" label="Contraseña" placeholder="••••••••">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-10.5a1.5 1.5 0 01-1.5-1.5v-7.5a1.5 1.5 0 011.5-1.5z" />
          </svg>
        </template>
      </Input>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm text-ink-600 cursor-pointer">
          <input v-model="remember" type="checkbox" class="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500" />
          Recordarme
        </label>
        <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700">¿Olvidaste tu contraseña?</a>
      </div>

      <Button type="submit" block size="lg">
        Iniciar sesión
      </Button>
    </form>

    <p class="text-center text-sm text-ink-500 mt-8">
      ¿No tienes una cuenta?
      <a href="#" class="font-semibold text-primary-600 hover:text-primary-700">Solicita acceso</a>
    </p>
  </div>
</template>
