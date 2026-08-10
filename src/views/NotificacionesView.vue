<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Centro de Notificaciones</h1>
        <p class="text-sm text-gray-500 mt-1">Avisos y alertas médicas consultadas desde MongoDB Atlas.</p>
      </div>
    </div>

    <!-- Alerta de estado -->
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
          :key="item.id || idx"
          :class="`p-4 border rounded-lg flex items-start justify-between space-x-4 transition ${item.leida ? 'bg-gray-50 border-gray-100 text-gray-600' : 'bg-blue-50/50 border-blue-100 text-gray-800'}`"
        >
          <div class="space-y-1 flex-1">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-sm">{{ item.titulo || item.title || 'Alerta de Monitoreo' }}</span>
              <span v-if="!item.leida" class="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">NUEVA</span>
            </div>
            <p class="text-xs text-gray-600">{{ item.mensaje || item.descripcion || item.description || 'Aviso registrado en el sistema.' }}</p>
            <span class="text-[11px] text-gray-400 block">{{ formatearFecha(item.fecha) }}</span>
          </div>

          <!-- Botones de Acción -->
          <div class="flex items-center space-x-2">
            <button
              v-if="!item.leida"
              @click="marcarLeida(item.id)"
              class="px-2.5 py-1 text-xs bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded shadow-sm transition"
              title="Marcar como leída"
            >
              ✓ Marcar leída
            </button>
            <button
              @click="eliminarNotificacion(item.id)"
              class="p-1 text-gray-400 hover:text-red-600 text-xs bg-white border border-gray-200 rounded shadow-sm transition"
              title="Eliminar notificación"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const notificaciones = ref([])
const cargando = ref(true)
const mensajeEstado = ref('')
const esError = ref(false)

const cargarNotificaciones = async () => {
  cargando.value = true
  try {
    const res = await api.get('/notificaciones')
    notificaciones.value = res.data
  } catch (err) {
    console.error('Error al cargar notificaciones:', err)
  } finally {
    cargando.value = false
  }
}

const marcarLeida = async (id) => {
  // Actualización optimista local inmediata para garantizar respuesta en UI
  const notif = notificaciones.value.find(n => n.id === id || n._id === id)
  if (notif) notif.leida = true

  try {
    await api.put(`/notificaciones/${id}/leer`)
    mensajeEstado.value = 'Notificación marcada como leída'
    esError.value = false
  } catch (err) {
    console.error('Error en API al marcar como leída:', err)
  }
}

const eliminarNotificacion = async (id) => {
  // Eliminación optimista local inmediata
  notificaciones.value = notificaciones.value.filter(n => n.id !== id && n._id !== id)
  mensajeEstado.value = 'Notificación eliminada correctamente'
  esError.value = false

  try {
    await api.delete(`/notificaciones/${id}`)
  } catch (err) {
    console.error('Error en API al eliminar:', err)
  }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleString() : ''

onMounted(() => { cargarNotificaciones() })
</script>