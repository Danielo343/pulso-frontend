<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Historial Médico Cifrado</h1>
        <p class="text-sm text-gray-500 mt-1">
          Información encriptada en servidor con el Algoritmo de Cifrado César (+5).
        </p>
      </div>
      <button
        @click="abrirModal"
        class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition"
      >
        + Nuevo Diagnóstico Cifrado
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <!-- Lista de Registros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">
        Cargando historial desde MongoDB y descifrando en servidor...
      </div>

      <div v-else-if="historial.length === 0" class="text-center py-8 text-gray-500 text-sm">
        No hay diagnósticos registrados en el historial médico.
      </div>

      <div v-else class="space-y-4">
        <div v-for="(item, index) in historial" :key="index" class="p-4 border rounded-lg bg-gray-50 space-y-2">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-gray-800 text-base">{{ item.titulo }}</h3>
            <span class="text-xs text-gray-400">{{ formatearFecha(item.fecha) }}</span>
          </div>
          <p class="text-sm text-gray-700"><strong>Diagnóstico:</strong> {{ item.diagnostico }}</p>
          <p v-if="item.notas" class="text-xs text-gray-500"><strong>Notas adicionales:</strong> {{ item.notas }}</p>
          <div class="pt-1">
            <span class="inline-block text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">
              🔒 Cifrado César Activo
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Diagnóstico -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800">Agregar Diagnóstico al Historial</h3>

        <form @submit.prevent="guardarNota" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Título / Motivo</label>
            <input v-model="form.titulo" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: Consulta General" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Diagnóstico (Se cifrará en BD)</label>
            <textarea v-model="form.diagnostico" required class="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Ej: Paciente presenta hipertensión leve..."></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Notas Médicas Adicionales</label>
            <textarea v-model="form.notas" class="w-full px-3 py-2 border rounded-lg text-sm" rows="2" placeholder="Indicaciones del médico..."></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="cerrarModal" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" :disabled="cargandoGuardado" class="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ cargandoGuardado ? 'Cifrando...' : 'Cifrar y Guardar' }}
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

const historial = ref([])
const cargando = ref(true)
const cargandoGuardado = ref(false)
const mostrarModal = ref(false)
const mensajeEstado = ref('')
const esError = ref(false)

const form = ref({
  titulo: '',
  diagnostico: '',
  notas: ''
})

const abrirModal = () => {
  form.value = { titulo: '', diagnostico: '', notas: '' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  form.value = { titulo: '', diagnostico: '', notas: '' }
  mostrarModal.value = false
}

const cargarHistorial = async () => {
  cargando.value = true
  try {
    const res = await api.get('/historial-medico')
    historial.value = res.data.historial || []
  } catch (err) {
    console.error('Error al cargar historial:', err)
  } finally {
    cargando.value = false
  }
}

const guardarNota = async () => {
  cargandoGuardado.value = true
  mensajeEstado.value = ''
  esError.value = false
  try {
    const res = await api.post('/historial-medico', form.value)
    mensajeEstado.value = res.data.mensaje || 'Registro cifrado guardado exitosamente.'
    cerrarModal()
    await cargarHistorial()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = err.response?.data?.mensaje || 'Error al guardar la nota cifrada.'
    console.error('Error al guardar nota cifrada:', err)
  } finally {
    cargandoGuardado.value = false
  }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleString() : ''

onMounted(() => {
  cargarHistorial()
})
</script>