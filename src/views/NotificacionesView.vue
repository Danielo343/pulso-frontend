<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Centro de Notificaciones</h1>
      <p class="text-sm text-gray-500 mt-1">Avisos y alertas médicas consultadas desde MongoDB Atlas.</p>
    </div>

    <!-- Alertas -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">Cargando notificaciones...</div>
      <div v-else-if="notificaciones.length === 0" class="text-center py-8 text-gray-500 text-sm">No tienes notificaciones pendientes.</div>

      <div v-else class="space-y-3">
        <div
          v-for="(item, idx) in notificaciones"
          :key="item.id || item._id || idx"
          :class="`p-4 border rounded-lg flex items-start justify-between space-x-4 ${item.leida ? 'bg-gray-50 border-gray-100' : 'bg-blue-50/50 border-blue-100'}`"
        >
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-gray-800 text-sm">{{ item.titulo || item.title || 'Alerta de Monitoreo' }}</span>
              <span v-if="!item.leida" class="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">NUEVA</span>
            </div>
            <p class="text-xs text-gray-600 mt-1">{{ item.mensaje || item.descripcion || 'Aviso registrado en el sistema.' }}</p>
            <p class="text-[10px] text-gray-400 mt-1">{{ formatearFecha(item.fecha) }}</p>
          </div>

          <button @click="eliminarNotificacion(item.id || item._id)" class="text-gray-400 hover:text-red-600 text-xs p-1" title="Eliminar notificación">
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useUiStore } from '../stores/ui'

const uiStore = useUiStore()

const notificaciones = ref([])
const cargando = ref(true)
const mensajeEstado = ref('')
const esError = ref(false)

const cargarNotificaciones = async () => {
  cargando.value = true
  try {
    const res = await api.get('/notificaciones')
    notificaciones.value = res.data || []
  } catch (err) {
    console.error('Error al cargar notificaciones:', err)
  } finally {
    cargando.value = false
  }
}

const eliminarNotificacion = async (id) => {
  try {
    await api.delete(`/notificaciones/${id}`)
    mensajeEstado.value = 'Notificación eliminada correctamente'
    uiStore.mostrarToast('Notificación eliminada', 'exito')
    await cargarNotificaciones()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al eliminar la notificación'
  }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleString() : ''

onMounted(() => { cargarNotificaciones() })
</script>