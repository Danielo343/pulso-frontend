<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const tabs = ['Perfil', 'Notificaciones', 'Seguridad', 'Preferencias']
const activeTab = ref('Perfil')

const toggles = ref([
  { label: 'Alertas de frecuencia cardíaca elevada', desc: 'Recibe una notificación inmediata ante lecturas anómalas', enabled: true },
  { label: 'Recordatorios de medicamentos', desc: 'Avisos antes de cada horario de toma', enabled: true },
  { label: 'Resumen semanal por correo', desc: 'Un resumen de salud cada lunes', enabled: false },
  { label: 'Alertas de batería baja', desc: 'Notificación cuando un dispositivo esté por descargarse', enabled: true }
])
</script>

<template>
  <div>
    <PageHeader
      title="Configuración"
      subtitle="Administra tu cuenta, notificaciones y preferencias"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Configuración' }]"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Tabs -->
      <nav class="lg:col-span-1 space-y-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="activeTab === tab ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20' : 'text-ink-500 hover:bg-ink-100'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </nav>

      <!-- Contenido -->
      <div class="lg:col-span-3 space-y-6">
        <Card v-if="activeTab === 'Perfil'">
          <template #header>
            <h3 class="font-semibold text-ink-900">Información de perfil</h3>
          </template>

          <div class="flex items-center gap-4 mb-6">
            <img :src="auth.user.avatar" alt="Foto de perfil" class="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-soft" />
            <div>
              <Button variant="outline" size="sm">Cambiar foto</Button>
              <p class="text-xs text-ink-400 mt-1.5">JPG o PNG. Máximo 2MB.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre completo" :model-value="auth.user.name" />
            <Input label="Rol" :model-value="auth.user.role" />
            <Input label="Correo electrónico" type="email" :model-value="auth.user.email" />
            <Input label="Teléfono" type="tel" placeholder="+52 33 1234 5678" />
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <Button variant="ghost">Cancelar</Button>
              <Button variant="primary">Guardar cambios</Button>
            </div>
          </template>
        </Card>

        <Card v-if="activeTab === 'Notificaciones'">
          <template #header>
            <h3 class="font-semibold text-ink-900">Preferencias de notificaciones</h3>
          </template>

          <ul class="divide-y divide-ink-100">
            <li v-for="(t, i) in toggles" :key="i" class="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div class="pr-4">
                <p class="text-sm font-medium text-ink-800">{{ t.label }}</p>
                <p class="text-xs text-ink-400 mt-0.5">{{ t.desc }}</p>
              </div>
              <button
                class="relative h-6 w-11 rounded-full transition-colors flex-shrink-0"
                :class="t.enabled ? 'bg-primary-600' : 'bg-ink-200'"
                @click="t.enabled = !t.enabled"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                  :class="t.enabled ? 'translate-x-5' : 'translate-x-0.5'"
                />
              </button>
            </li>
          </ul>
        </Card>

        <Card v-if="activeTab === 'Seguridad'">
          <template #header>
            <h3 class="font-semibold text-ink-900">Seguridad de la cuenta</h3>
          </template>
          <div class="space-y-4">
            <Input label="Contraseña actual" type="password" placeholder="••••••••" />
            <Input label="Nueva contraseña" type="password" placeholder="••••••••" />
            <Input label="Confirmar nueva contraseña" type="password" placeholder="••••••••" />
          </div>
          <template #footer>
            <div class="flex justify-end">
              <Button variant="primary">Actualizar contraseña</Button>
            </div>
          </template>
        </Card>

        <Card v-if="activeTab === 'Preferencias'">
          <template #header>
            <h3 class="font-semibold text-ink-900">Preferencias generales</h3>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Idioma" model-value="Español" />
            <Input label="Zona horaria" model-value="GMT-6 (Ciudad de México)" />
            <Input label="Unidad de temperatura" model-value="Celsius (°C)" />
            <Input label="Formato de fecha" model-value="DD/MM/AAAA" />
          </div>
          <template #footer>
            <div class="flex justify-end">
              <Button variant="primary">Guardar preferencias</Button>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
