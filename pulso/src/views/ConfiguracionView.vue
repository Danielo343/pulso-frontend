<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Configuración de Cuenta</h1>
      <p class="text-sm text-gray-500 mt-1">Edita tus datos personales y gestiona respaldos del sistema.</p>
    </div>

    <!-- Alertas -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <!-- Formulario de Editar Perfil -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">Perfil de Usuario</h2>

      <form @submit.prevent="guardarPerfil" class="space-y-4 max-w-md">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input v-model="formPerfil.nombre" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico (Solo Lectura)</label>
          <input :value="authStore.usuario?.correo || authStore.usuario?.email" type="email" disabled class="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-500" />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
          <input v-model="formPerfil.telefono" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: 3312345678" />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Cambiar Contraseña (Opcional)</label>
          <input v-model="formPerfil.password" type="password" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="••••••••" />
        </div>

        <button type="submit" :disabled="cargandoPerfil" class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
          {{ cargandoPerfil ? 'Guardando...' : 'Actualizar Perfil' }}
        </button>
      </form>
    </div>

    <!-- Módulo de Respaldos JSON -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div class="border-b border-gray-100 pb-3">
        <h2 class="text-lg font-semibold text-gray-800">Gestión de Respaldos Lógicos (JSON)</h2>
        <p class="text-sm text-gray-500 mt-1">Exporta o restaura información estructurada en archivo .json.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div class="p-4 border rounded-lg bg-gray-50 space-y-3">
          <h3 class="font-medium text-gray-800 text-sm">Exportar Respaldo</h3>
          <button @click="exportarRespaldo" class="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Descargar Respaldo JSON
          </button>
        </div>

        <div class="p-4 border rounded-lg bg-gray-50 space-y-3">
          <h3 class="font-medium text-gray-800 text-sm">Restaurar Respaldo</h3>
          <input type="file" ref="inputArchivo" @change="importarRespaldo" accept=".json" class="hidden" />
          <button @click="$refs.inputArchivo.click()" class="w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Seleccionar Archivo JSON
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()
const cargandoPerfil = ref(false)
const mensajeEstado = ref('')
const esError = ref(false)
const inputArchivo = ref(null)

const formPerfil = ref({
  nombre: authStore.usuario?.nombre || authStore.usuario?.name || '',
  telefono: authStore.usuario?.telefono || '',
  password: ''
})

const guardarPerfil = async () => {
  cargandoPerfil.value = true
  mensajeEstado.value = ''
  esError.value = false
  try {
    const res = await api.put('/perfil', formPerfil.value)
    authStore.usuario = res.data.usuario
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    mensajeEstado.value = 'Perfil actualizado exitosamente'
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al actualizar el perfil'
  } finally {
    cargandoPerfil.value = false
  }
}

const exportarRespaldo = async () => {
  try {
    const res = await api.get('/respaldo/exportar', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `respaldo_pulso_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    mensajeEstado.value = 'Respaldo JSON descargado'
  } catch (err) {
    esError.value = true; mensajeEstado.value = 'Error al descargar respaldo'
  }
}

const importarRespaldo = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('archivo_respaldo', file)
  try {
    const res = await api.post('/respaldo/importar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    mensajeEstado.value = res.data.mensaje || 'Respaldo importado'
  } catch (err) {
    esError.value = true; mensajeEstado.value = 'Error al importar'
  }
}
</script>