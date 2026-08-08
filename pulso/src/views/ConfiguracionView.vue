<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Título de la Sección -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Configuración</h1>
      <p class="text-sm text-gray-500 mt-1">Gestiona tu perfil de usuario y la administración de datos de la plataforma.</p>
    </div>

    <!-- Alertas de Estado -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <!-- Perfil de Usuario -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h2 class="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">Perfil de Usuario</h2>
      
      <div class="flex items-center space-x-4">
        <img
          :src="usuarioAvatar"
          alt="Avatar de usuario"
          class="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
        />
        <div>
          <h3 class="text-base font-bold text-gray-900">{{ usuarioNombre }}</h3>
          <p class="text-sm text-gray-500">{{ usuarioCorreo }}</p>
          <span class="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {{ usuarioRol }}
          </span>
        </div>
      </div>
    </div>

    <!-- Módulo de Respaldos Lógicos JSON -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div class="border-b border-gray-100 pb-3">
        <h2 class="text-lg font-semibold text-gray-800">Gestión de Respaldos Lógicos (JSON)</h2>
        <p class="text-sm text-gray-500 mt-1">Exporta un archivo JSON estructurado con tus datos o restaura información desde un archivo de respaldo.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <!-- Exportar Respaldo -->
        <div class="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
          <h3 class="font-medium text-gray-800 text-sm flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Exportar Datos en JSON</span>
          </h3>
          <p class="text-xs text-gray-600">Descarga una copia completa de tus expedientes y mediciones en un archivo .json estructurado.</p>
          <button
            @click="exportarRespaldo"
            :disabled="cargandoExportacion"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center shadow-sm"
          >
            <span>{{ cargandoExportacion ? 'Generando archivo...' : 'Descargar Respaldo JSON' }}</span>
          </button>
        </div>

        <!-- Importar Respaldo -->
        <div class="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
          <h3 class="font-medium text-gray-800 text-sm flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Restaurar desde JSON</span>
          </h3>
          <p class="text-xs text-gray-600">Selecciona un archivo .json de respaldo previo para sincronizar y restaurar tu información.</p>
          <input
            type="file"
            ref="inputArchivo"
            @change="importarRespaldo"
            accept=".json,application/json"
            class="hidden"
          />
          <button
            @click="$refs.inputArchivo.click()"
            :disabled="cargandoImportacion"
            class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center shadow-sm"
          >
            <span>{{ cargandoImportacion ? 'Procesando...' : 'Seleccionar Archivo JSON' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

const cargandoExportacion = ref(false)
const cargandoImportacion = ref(false)
const mensajeEstado = ref('')
const esError = ref(false)
const inputArchivo = ref(null)

// Propiedades computadas seguras
const usuarioNombre = computed(() => {
  return authStore.usuario?.nombre || authStore.usuario?.name || 'Usuario Pulso'
})

const usuarioCorreo = computed(() => {
  return authStore.usuario?.correo || authStore.usuario?.email || 'admin@pulso.com'
})

const usuarioRol = computed(() => {
  return authStore.usuario?.rol || 'Administrador'
})

const usuarioAvatar = computed(() => {
  return authStore.usuario?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioNombre.value)}&background=0D8ABC&color=fff`
})

// Exportar Respaldo JSON
const exportarRespaldo = async () => {
  cargandoExportacion.value = true
  mensajeEstado.value = ''
  esError.value = false

  try {
    const respuesta = await api.get('/respaldo/exportar', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([respuesta.data]))
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.setAttribute('download', `respaldo_pulso_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(enlace)
    enlace.click()
    document.body.removeChild(enlace)

    mensajeEstado.value = '¡Respaldo JSON descargado exitosamente!'
  } catch (error) {
    esError.value = true
    mensajeEstado.value = 'Error al descargar el archivo de respaldo.'
    console.error(error)
  } finally {
    cargandoExportacion.value = false
  }
}

// Importar Respaldo JSON
const importarRespaldo = async (evento) => {
  const archivo = evento.target.files[0]
  if (!archivo) return

  cargandoImportacion.value = true
  mensajeEstado.value = ''
  esError.value = false

  const formData = new FormData()
  formData.append('archivo_respaldo', archivo)

  try {
    const respuesta = await api.post('/respaldo/importar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    mensajeEstado.value = respuesta.data.mensaje || 'Respaldo importado con éxito.'
  } catch (error) {
    esError.value = true
    mensajeEstado.value = error.response?.data?.mensaje || 'Error al importar el archivo de respaldo.'
    console.error(error)
  } finally {
    cargandoImportacion.value = false
    evento.target.value = ''
  }
}
</script>