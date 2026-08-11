<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Eventos y Citas Médicas</h1>
        <p class="text-sm text-gray-500 mt-1">Gestión dinámica de eventos consultados desde MongoDB Atlas.</p>
      </div>
      <button @click="abrirModal" class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
        + Nuevo Evento
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">Cargando eventos desde MongoDB...</div>
      <div v-else-if="eventos.length === 0" class="text-center py-8 text-gray-500 text-sm">No hay eventos ni citas agendadas.</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(item, idx) in eventos" :key="idx" class="p-4 border rounded-lg bg-gray-50 space-y-2">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase text-purple-600 bg-purple-50 px-2 py-1 rounded">{{ item.tipo }}</span>
            <span class="text-xs text-gray-400">{{ formatearFecha(item.fecha) }}</span>
          </div>
          <h3 class="font-bold text-gray-800 text-base">{{ item.titulo }}</h3>
          <p class="text-sm text-gray-600">{{ item.descripcion }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Evento -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800">Agendar Evento / Cita</h3>
        <form @submit.prevent="guardarEvento" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Título del Evento</label>
            <input v-model="form.titulo" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: Consulta Cardiólogo" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tipo de Evento</label>
            <select v-model="form.tipo" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
              <option value="cita_medica">Cita Médica</option>
              <option value="alerta_medica">Alerta de Salud</option>
              <option value="seguimiento">Seguimiento Rutinario</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.descripcion" required class="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Detalles del evento..."></textarea>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="cerrarModal" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" :disabled="cargandoGuardado" class="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ cargandoGuardado ? 'Guardando...' : 'Guardar Evento' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useUiStore } from '../stores/ui'

const uiStore = useUiStore()

const eventos = ref([])
const cargando = ref(true)
const cargandoGuardado = ref(false)
const mostrarModal = ref(false)
const mensajeEstado = ref('')
const esError = ref(false)

const form = ref({ titulo: '', descripcion: '', tipo: 'cita_medica' })

const abrirModal = () => {
  form.value = { titulo: '', descripcion: '', tipo: 'cita_medica' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  form.value = { titulo: '', descripcion: '', tipo: 'cita_medica' }
  mostrarModal.value = false
}

const cargarEventos = async () => {
  cargando.value = true
  try {
    const res = await api.get('/eventos')
    eventos.value = res.data || []
  } catch (err) {
    console.error('Error al cargar eventos:', err)
  } finally {
    cargando.value = false
  }
}

const guardarEvento = async () => {
  cargandoGuardado.value = true
  mensajeEstado.value = ''
  esError.value = false
  try {
    const res = await api.post('/eventos', form.value)
    mensajeEstado.value = res.data.mensaje || 'Evento guardado exitosamente.'
    
    // Disparar Notificación Flotante Emergente
    uiStore.mostrarToast(`📅 Nueva cita agendada: ${form.value.titulo}`, 'alerta')
    
    cerrarModal()
    await cargarEventos()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al guardar el evento.'
    console.error('Error al guardar evento:', err)
  } finally {
    cargandoGuardado.value = false
  }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleString() : ''

onMounted(() => { cargarEventos() })
</script>