<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Medicamentos</h1>
        <p class="text-sm text-gray-500 mt-1">Gestión y seguimiento de tratamiento</p>
      </div>
      <button
        @click="abrirModalCrear"
        class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition flex items-center space-x-2"
      >
        <span>+ Agregar Medicamento</span>
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <!-- Tarjetas KPI Superiores -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500">Total Hoy</p>
          <p class="text-3xl font-bold text-gray-800 mt-1">6</p>
        </div>
        <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xl">💊</div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500">Completados</p>
          <p class="text-3xl font-bold text-green-600 mt-1">4</p>
        </div>
        <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 text-xl">✓</div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500">Pendientes</p>
          <p class="text-3xl font-bold text-amber-500 mt-1">2</p>
        </div>
        <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 text-xl">⚠️</div>
      </div>
    </div>

    <!-- Grid Principal de 2 Columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna Izquierda: Calendario de Medicamentos Interactivo con Tooltip Hover -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-base font-bold text-gray-800">Calendario de Medicamentos</h2>
            <p class="text-xs text-gray-400 mt-0.5">Agosto 2026 - Día Seleccionado: <strong class="text-blue-600">Día {{ diaSeleccionado }}</strong></p>
          </div>
          <span class="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
            Haz clic en un día o pasa el ratón para ver la agenda
          </span>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 border-b pb-2">
          <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
        </div>

        <!-- Rejilla Mensual 28 Días Seleccionable con Cuadro Flotante Tooltip -->
        <div class="grid grid-cols-7 gap-2 text-center">
          <div
            v-for="dia in 28"
            :key="dia"
            @click="diaSeleccionado = dia"
            :class="`group relative p-3 rounded-lg border text-xs font-medium flex flex-col items-center justify-between h-20 transition cursor-pointer ${
              diaSeleccionado === dia ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md scale-105' : 'bg-white border-gray-100 hover:border-blue-300 text-gray-700'
            }`"
          >
            <span>{{ dia }}</span>

            <!-- Indicadores de estado -->
            <div class="flex space-x-1 mt-1">
              <span v-if="dia % 2 === 0" :class="`w-1.5 h-1.5 rounded-full ${diaSeleccionado === dia ? 'bg-white' : 'bg-green-500'}`"></span>
              <span v-if="dia % 5 === 0" :class="`w-1.5 h-1.5 rounded-full ${diaSeleccionado === dia ? 'bg-amber-200' : 'bg-amber-500'}`"></span>
              <span v-if="dia % 7 === 0" :class="`w-1.5 h-1.5 rounded-full ${diaSeleccionado === dia ? 'bg-red-200' : 'bg-red-500'}`"></span>
            </div>

            <!-- Cuadro Flotante Tooltip que aparece al colocar el cursor encima -->
            <div class="hidden group-hover:block absolute bottom-full mb-2 z-40 w-48 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl text-left pointer-events-none">
              <p class="font-bold border-b border-gray-700 pb-1 mb-1">Agenda Día {{ dia }}</p>
              <p class="text-green-300">💊 Losartán 50mg (08:00)</p>
              <p class="text-amber-300">💊 Metformina 850mg (20:00)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Tratamientos Agendados (con Editar/Eliminar) e Historial -->
      <div class="space-y-6">
        <!-- Próximas Tomas con botones Editar y Eliminar -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-base font-bold text-gray-800">Tratamientos Agendados</h2>
          </div>

          <div v-if="cargando" class="text-xs text-gray-400 text-center py-4">Cargando tratamiento...</div>
          <div v-else-if="medicamentos.length === 0" class="text-xs text-gray-400 text-center py-4">No hay medicamentos agendados.</div>

          <div v-else class="space-y-3">
            <div
              v-for="m in medicamentos"
              :key="m.id || m._id"
              class="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between"
            >
              <div>
                <p class="font-bold text-xs text-gray-800">{{ m.nombre }}</p>
                <p class="text-[11px] text-gray-500">{{ m.dosis }} • {{ m.horario }}</p>
              </div>

              <div class="flex items-center space-x-1">
                <button @click="abrirModalEditar(m)" class="text-gray-400 hover:text-blue-600 text-xs p-1" title="Editar Dosis/Horario">✏️</button>
                <button @click="eliminarMedicamento(m.id || m._id)" class="text-gray-400 hover:text-red-600 text-xs p-1" title="Eliminar Medicamento">🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial del Día -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-800">Historial del Día {{ diaSeleccionado }}</h2>

          <div class="space-y-2.5">
            <div
              v-for="(log, idx) in historialHoy"
              :key="idx"
              class="p-3 border border-gray-100 rounded-xl flex items-center justify-between bg-white hover:bg-gray-50/50 transition"
            >
              <div>
                <p class="font-bold text-xs text-gray-800">{{ log.nombre }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ log.detalle }}</p>
              </div>
              <span :class="`text-sm font-bold ${log.tomado ? 'text-green-500' : 'text-gray-300'}`">
                {{ log.tomado ? '✓' : '🕒' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Agregar / Editar Medicamento con Auto-Formato de Hora -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800">{{ modoEdicion ? 'Editar Medicamento / Dosis' : 'Agregar Medicamento' }}</h3>
        <form @submit.prevent="guardarMedicamento" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre del Medicamento</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: Losartán 50mg" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Dosis / Indicación</label>
            <input v-model="form.dosis" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: 1 tableta cada 24 hrs" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Horario (Autocompleta 8 -> 08:00, 8:30 -> 08:30)</label>
            <input
              v-model="form.horario"
              @blur="formatearHoraAuto"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg text-sm font-mono"
              placeholder="Ej: 08:00 o 20:00"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="cerrarModal" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" :disabled="cargandoGuardado" class="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ cargandoGuardado ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useUiStore } from '../stores/ui'

const uiStore = useUiStore()

const medicamentos = ref([])
const cargando = ref(true)
const cargandoGuardado = ref(false)
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const medTargetId = ref(null)

const mensajeEstado = ref('')
const esError = ref(false)
const diaSeleccionado = ref(27)

const form = ref({ nombre: '', dosis: '', horario: '08:00' })

const formatearHoraAuto = () => {
  let val = form.value.horario.trim()
  if (!val) return
  if (/^\d{1,2}$/.test(val)) {
    let num = parseInt(val, 10)
    if (num >= 0 && num <= 23) {
      form.value.horario = (num < 10 ? '0' + num : num) + ':00'
    }
  } else if (/^\d{1,2}:\d{2}$/.test(val)) {
    let partes = val.split(':')
    let h = parseInt(partes[0], 10)
    let m = partes
    form.value.horario = (h < 10 ? '0' + h : h) + ':' + m
  }
}

const historialHoy = computed(() => [
  { nombre: 'Losartán', detalle: 'Programado: 08:00 • Tomado: 08:15', tomado: true },
  { nombre: 'Metformina', detalle: 'Programado: 08:00 • Tomado: 08:15', tomado: true },
  { nombre: 'Ácido Acetilsalicílico', detalle: 'Programado: 08:00 • Tomado: 08:15', tomado: true },
  { nombre: 'Metformina', detalle: 'Programado: 14:00 • Tomado: 14:10', tomado: true },
  { nombre: 'Losartán', detalle: 'Programado: 20:00', tomado: false },
  { nombre: 'Metformina', detalle: 'Programado: 20:00', tomado: false }
])

const abrirModalCrear = () => {
  modoEdicion.value = false
  medTargetId.value = null
  form.value = { nombre: '', dosis: '1 tableta', horario: '08:00' }
  mostrarModal.value = true
}

const abrirModalEditar = (item) => {
  modoEdicion.value = true
  medTargetId.value = item.id || item._id
  form.value = {
    nombre: item.nombre || '',
    dosis: item.dosis || '',
    horario: item.horario || '08:00'
  }
  mostrarModal.value = true
}

const cerrarModal = () => {
  form.value = { nombre: '', dosis: '', horario: '08:00' }
  mostrarModal.value = false
}

const cargarMedicamentos = async () => {
  cargando.value = true
  try {
    const res = await api.get('/medicamentos')
    medicamentos.value = res.data || []
  } catch (err) {
    console.error('Error al cargar medicamentos:', err)
  } finally {
    cargando.value = false
  }
}

const guardarMedicamento = async () => {
  cargandoGuardado.value = true
  mensajeEstado.value = ''
  esError.value = false
  try {
    if (modoEdicion.value) {
      await api.put(`/medicamentos/${medTargetId.value}`, form.value)
      mensajeEstado.value = 'Medicamento actualizado con éxito'
      uiStore.mostrarToast('💊 Dosis actualizada', 'exito')
    } else {
      await api.post('/medicamentos', form.value)
      mensajeEstado.value = 'Medicamento guardado con éxito'
      uiStore.mostrarToast('💊 Nuevo tratamiento registrado', 'exito')
    }
    cerrarModal()
    await cargarMedicamentos()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al guardar medicamento'
  } finally {
    cargandoGuardado.value = false
  }
}

const eliminarMedicamento = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este medicamento de tu tratamiento?')) return
  try {
    await api.delete(`/medicamentos/${id}`)
    mensajeEstado.value = 'Medicamento eliminado correctamente'
    uiStore.mostrarToast('Medicamento eliminado', 'exito')
    await cargarMedicamentos()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al eliminar el medicamento'
  }
}

onMounted(() => { cargarMedicamentos() })
</script>