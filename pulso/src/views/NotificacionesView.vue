<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Centro de Notificaciones</h1>
      <p class="text-sm text-gray-500 mt-1">Avisos y alertas médicas consultadas desde MongoDB Atlas.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">Cargando notificaciones...</div>
      <div v-else-if="notificaciones.length === 0" class="text-center py-8 text-gray-500 text-sm">No tienes notificaciones pendientes.</div>

      <div v-else class="space-y-3">
        <div
          v-for="(item, idx) in notificaciones"
          :key="idx"
          :class="`p-4 border rounded-lg flex items-start justify-between space-x-4 ${item.leida ? 'bg-gray-50 border-gray-100' : 'bg-blue-50/50 border-blue-100'}`"
        >
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-bold text-gray-800 text-sm">{{ item.titulo || item.title || 'Alerta de Monitoreo' }}</span>
              <span v-if="!item.leida" class="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">NUEVA</span>
            </div>
            <p class="text-xs text-gray-600 mt-1">{{ item.mensaje || item.descripcion || item.description || 'Aviso registrado en el sistema.' }}</p>
          </div>
          <span class="text-[11px] text-gray-400 whitespace-nowrap">{{ formatearFecha(item.fecha) }}</span>
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

const formatearFecha = (f) => f ? new Date(f).toLocaleString() : ''

onMounted(() => { cargarNotificaciones() })
</script>