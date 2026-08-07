<script setup>
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

const ui = useUiStore()
const auth = useAuthStore()
const userMenuOpen = ref(false)
const notifOpen = ref(false)

const notifPreview = [
  { id: 1, text: 'Frecuencia cardíaca elevada — Antonio Ruiz', time: 'Hace 12 min', tone: 'danger' },
  { id: 2, text: 'Medicamento tomado — Rosa Martínez', time: 'Hace 40 min', tone: 'success' },
  { id: 3, text: 'Batería baja — Monitor Pulso H1', time: 'Hace 1 h', tone: 'warning' }
]
</script>

<template>
  <header class="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-ink-200/70 shadow-nav">
    <div class="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          class="h-9 w-9 flex items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 lg:hidden"
          @click="ui.toggleSidebar()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        <div class="flex items-center gap-2 lg:hidden">
          <div class="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h4l1.5-4L12 18l2-9 1.5 3H22" />
            </svg>
          </div>
          <span class="font-display font-extrabold text-ink-900">Pulso</span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Notificaciones -->
        <div class="relative">
          <button
            class="relative h-10 w-10 flex items-center justify-center rounded-xl text-ink-500 hover:bg-ink-100 transition-colors"
            @click="notifOpen = !notifOpen; userMenuOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span class="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="notifOpen"
              class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-ink-200/70 overflow-hidden"
            >
              <div class="px-4 py-3 border-b border-ink-200/70 flex items-center justify-between">
                <p class="text-sm font-semibold text-ink-900">Notificaciones</p>
                <RouterLink to="/notificaciones" class="text-xs font-medium text-primary-600 hover:text-primary-700" @click="notifOpen = false">
                  Ver todas
                </RouterLink>
              </div>
              <ul class="divide-y divide-ink-100 max-h-72 overflow-y-auto">
                <li v-for="n in notifPreview" :key="n.id" class="px-4 py-3 hover:bg-surface-muted transition-colors">
                  <div class="flex items-start gap-2.5">
                    <span
                      class="mt-1 h-2 w-2 rounded-full flex-shrink-0"
                      :class="{
                        'bg-red-500': n.tone === 'danger',
                        'bg-accent-500': n.tone === 'success',
                        'bg-amber-500': n.tone === 'warning'
                      }"
                    />
                    <div>
                      <p class="text-sm text-ink-700 leading-snug">{{ n.text }}</p>
                      <p class="text-xs text-ink-400 mt-0.5">{{ n.time }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <div class="w-px h-6 bg-ink-200 hidden sm:block"></div>

        <!-- Menú de usuario -->
        <div class="relative">
          <button
            class="flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 h-10 rounded-xl hover:bg-ink-100 transition-colors"
            @click="userMenuOpen = !userMenuOpen; notifOpen = false"
          >
            <img :src="auth.user.avatar" alt="Foto de perfil" class="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
            <span class="hidden sm:flex flex-col items-start leading-tight">
              <span class="text-sm font-semibold text-ink-900">{{ auth.user.name }}</span>
              <span class="text-xs text-ink-400">{{ auth.user.role }}</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-ink-400 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-ink-200/70 overflow-hidden py-1.5"
            >
              <div class="px-4 py-2.5 border-b border-ink-200/70">
                <p class="text-sm font-semibold text-ink-900 truncate">{{ auth.user.name }}</p>
                <p class="text-xs text-ink-400 truncate">{{ auth.user.email }}</p>
              </div>
              <RouterLink to="/configuracion" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-600 hover:bg-surface-muted transition-colors" @click="userMenuOpen = false">
                Mi perfil
              </RouterLink>
              <RouterLink to="/configuracion" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-600 hover:bg-surface-muted transition-colors" @click="userMenuOpen = false">
                Configuración
              </RouterLink>
              <RouterLink to="/login" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors" @click="userMenuOpen = false">
                Cerrar sesión
              </RouterLink>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>
