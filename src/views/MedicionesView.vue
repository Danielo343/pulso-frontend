<template>
  <div class="space-y-6">
    <!-- Banner de Alerta / Error -->
    <div
      v-if="alerta.mostrar"
      :class="[
        'p-4 rounded-xl flex items-center justify-between shadow-sm border transition-all',
        alerta.tipo === 'exito'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-rose-50 text-rose-800 border-rose-200'
      ]"
    >
      <div class="flex items-center space-x-2">
        <span class="text-base">{{ alerta.tipo === 'exito' ? '✓' : '⚠️' }}</span>
        <span class="text-sm font-medium">{{ alerta.mensaje }}</span>
      </div>
      <button @click="alerta.mostrar = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
    </div>

    <!-- Encabezado Principal -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mediciones de Salud</h1>
        <p class="text-sm text-gray-500">Registro y monitoreo de signos vitales con rangos médicamente válidos</p>
      </div>
      <button
        @click="abrirModalNuevo"
        class="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors space-x-2"
      >
        <span class="text-lg font-bold">+</span>
        <span>Nueva Medición</span>
      </button>
    </div>

    <!-- Tarjetas de Resumen Rápido -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="cat in categoriasPredefinidas" :key="cat.tipo" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ cat.tipo }}</p>
          <p class="text-xl font-extrabold text-gray-900 mt-1">
            {{ obtenerUltimoValor(cat.tipo) }} <span class="text-xs font-normal text-gray-500">{{ cat.unidad }}</span>
          </p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          {{ cat.icono }}
        </div>
      </div>
    </div>

    <!-- Lista de Mediciones -->
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">Historial de Mediciones</h2>
        <span class="text-xs text-gray-400 font-medium">Total: {{ mediciones.length }} registros</span>
      </div>

      <div v-if="mediciones.length === 0" class="text-center py-12 text-gray-400 text-sm">
        No hay mediciones registradas. ¡Agrega la primera!
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in mediciones"
          :key="obtenerId(item)"
          class="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200/60 flex items-center justify-between transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg shrink-0">
              {{ obtenerIconoTipo(item.tipo_medicion) }}
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm">
                {{ item.tipo_medicion }}: <span class="text-blue-600 font-extrabold">{{ item.valor }} {{ item.unidad }}</span>
              </p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ item.fecha_hora || 'Reciente' }} {{ item.notas ? '• ' + item.notas : '' }}
              </p>
            </div>
          </div>

          <button
            @click="eliminarMedicion(item)"
            class="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Eliminar de MongoDB"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Estricto con Validación Médica -->
    <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <h3 class="text-lg font-bold text-gray-900">Registrar Signo Vital</h3>
          <button @click="modalAbierto = false" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form @submit.prevent="guardarMedicion" class="space-y-4">
          <!-- Tipo de Medición -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Medición</label>
            <select
              v-model="formulario.tipo_medicion"
              @change="actualizarUnidadYRangos"
              required
              class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
            >
              <option value="" disabled>Selecciona el tipo de medición</option>
              <option v-for="cat in categoriasPredefinidas" :key="cat.tipo" :value="cat.tipo">
                {{ cat.icono }} {{ cat.tipo }} ({{ cat.unidad }})
              </option>
            </select>
          </div>

          <!-- Campos Específicos para Presión Arterial -->
          <div v-if="formulario.tipo_medicion === 'Presión Arterial'" class="space-y-2">
            <label class="block text-xs font-bold text-gray-700 uppercase">Presión Arterial (mmHg)</label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-gray-500 font-medium mb-1">Sistólica (Alta)</label>
                <input
                  v-model.number="formulario.sistolica"
                  type="number"
                  min="50"
                  max="250"
                  required
                  placeholder="Ej. 120"
                  class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span class="text-[10px] text-gray-400">Rango: 50-250</span>
              </div>
              <div>
                <label class="block text-[11px] text-gray-500 font-medium mb-1">Diastólica (Baja)</label>
                <input
                  v-model.number="formulario.diastolica"
                  type="number"
                  min="30"
                  max="150"
                  required
                  placeholder="Ej. 80"
                  class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span class="text-[10px] text-gray-400">Rango: 30-150</span>
              </div>
            </div>
          </div>

          <!-- Campo Numérico Validado para otros Signos Vitales -->
          <div v-else class="grid grid-cols-3 gap-3">
            <div class="col-span-2">
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Registrado</label>
              <input
                v-model.number="formulario.valorNumerico"
                type="number"
                :min="categoriaActual.min"
                :max="categoriaActual.max"
                :step="categoriaActual.step"
                required
                :placeholder="`Ej. ${categoriaActual.ejemplo}`"
                class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span class="text-[10px] text-gray-400">Rango válido: {{ categoriaActual.min }} a {{ categoriaActual.max }} {{ categoriaActual.unidad }}</span>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Unidad</label>
              <input
                v-model="formulario.unidad"
                type="text"
                readonly
                class="w-full px-3.5 py-2 text-sm border border-gray-200 bg-gray-100 rounded-xl text-gray-600 font-bold outline-none cursor-not-allowed text-center"
              />
            </div>
          </div>

          <!-- Notas / Estado -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Estado del Paciente</label>
            <select
              v-model="formulario.notas"
              class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="En reposo">En reposo</option>
              <option value="En ayunas">En ayunas</option>
              <option value="Después de comer">Después de comer</option>
              <option value="Post-ejercicio">Después de hacer ejercicio</option>
              <option value="Sin observaciones">Sin observaciones especiales</option>
            </select>
          </div>

          <!-- Acciones del Modal -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              @click="modalAbierto = false"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              Guardar Medición
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const mediciones = ref([])
const modalAbierto = ref(false)

const alerta = ref({ mostrar: false, mensaje: '', tipo: 'exito' })
const mostrarAlerta = (msg, tipo = 'exito') => {
  alerta.value = { mostrar: true, mensaje: msg, tipo }
  setTimeout(() => { alerta.value.mostrar = false }, 4000)
}

const categoriasPredefinidas = [
  { tipo: 'Presión Arterial', unidad: 'mmHg', icono: '🫀', ejemplo: '120/80', min: 50, max: 250, step: 1 },
  { tipo: 'Frecuencia Cardíaca', unidad: 'bpm', icono: '💓', ejemplo: '72', min: 30, max: 220, step: 1 },
  { tipo: 'Glucosa en Sangre', unidad: 'mg/dL', icono: '🩸', ejemplo: '95', min: 40, max: 600, step: 1 },
  { tipo: 'Saturación de Oxígeno', unidad: '%', icono: '🫁', ejemplo: '98', min: 50, max: 100, step: 1 },
  { tipo: 'Temperatura Corporal', unidad: '°C', icono: '🌡️', ejemplo: '36.5', min: 30.0, max: 43.0, step: 0.1 },
  { tipo: 'Peso Corporal', unidad: 'kg', icono: '⚖️', ejemplo: '68.5', min: 1.0, max: 350.0, step: 0.1 }
]

const formulario = ref({
  tipo_medicion: 'Presión Arterial',
  sistolica: 120,
  diastolica: 80,
  valorNumerico: 95,
  unidad: 'mmHg',
  notas: 'En reposo'
})

const categoriaActual = computed(() => {
  return categoriasPredefinidas.find(c => c.tipo === formulario.value.tipo_medicion) || categoriasPredefinidas[0]
})

const obtenerId = (item) => String(item._id || item.id || '')

const obtenerIconoTipo = (tipo) => {
  const cat = categoriasPredefinidas.find(c => c.tipo.toLowerCase() === String(tipo).toLowerCase())
  return cat ? cat.icono : '📊'
}

const actualizarUnidadYRangos = () => {
  const cat = categoriaActual.value
  formulario.value.unidad = cat.unidad
  if (cat.tipo === 'Presión Arterial') {
    formulario.value.sistolica = 120
    formulario.value.diastolica = 80
  } else {
    formulario.value.valorNumerico = parseFloat(cat.ejemplo) || 70
  }
}

const obtenerUltimoValor = (tipo) => {
  const coincidencia = mediciones.value.find(m => m.tipo_medicion === tipo)
  return coincidencia ? coincidencia.valor : '--'
}

const cargarMediciones = async () => {
  try {
    const res = await api.get('/mediciones')
    const datos = res.data?.data || res.data || []
    mediciones.value = datos.map(m => ({ ...m, id: obtenerId(m), _id: obtenerId(m) }))
  } catch (e) {
    console.warn('Cargando mediciones')
  }
}

const abrirModalNuevo = () => {
  modalAbierto.value = true
  formulario.value = {
    tipo_medicion: 'Presión Arterial',
    sistolica: 120,
    diastolica: 80,
    valorNumerico: 95,
    unidad: 'mmHg',
    notas: 'En reposo'
  }
}

// Validaciones clínicas antes de guardar
const validarClinicamente = () => {
  const tipo = formulario.value.tipo_medicion

  if (tipo === 'Presión Arterial') {
    const sis = formulario.value.sistolica
    const dias = formulario.value.diastolica

    if (!sis || !dias || sis < 50 || sis > 250 || dias < 30 || dias > 150) {
      mostrarAlerta('Rango de Presión Arterial fuera de límites válidos (Sistólica: 50-250, Diastólica: 30-150).', 'error')
      return false
    }
    if (sis <= dias) {
      mostrarAlerta('La presión sistólica (alta) debe ser mayor que la diastólica (baja).', 'error')
      return false
    }
    return true
  }

  const val = formulario.value.valorNumerico
  const cat = categoriaActual.value

  if (val === null || val === undefined || isNaN(val)) {
    mostrarAlerta('Ingresa un valor numérico válido.', 'error')
    return false
  }

  if (val < cat.min || val > cat.max) {
    mostrarAlerta(`El valor para ${cat.tipo} debe estar entre ${cat.min} y ${cat.max} ${cat.unidad}.`, 'error')
    return false
  }

  return true
}

const guardarMedicion = async () => {
  if (!validarClinicamente()) return

  let valorFinal = ''
  if (formulario.value.tipo_medicion === 'Presión Arterial') {
    valorFinal = `${formulario.value.sistolica}/${formulario.value.diastolica}`
  } else {
    valorFinal = String(formulario.value.valorNumerico)
  }

  const fecha = new Date()
  const fechaFormateada = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')} ${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`

  const payload = {
    tipo_medicion: formulario.value.tipo_medicion,
    valor: valorFinal,
    unidad: formulario.value.unidad,
    notas: formulario.value.notas,
    fecha_hora: fechaFormateada
  }

  try {
    const res = await api.post('/mediciones', payload)
    const nuevo = res.data?.data || { ...payload, _id: String(Date.now()), id: String(Date.now()) }
    mediciones.value.unshift({ ...nuevo, _id: obtenerId(nuevo), id: obtenerId(nuevo) })
    mostrarAlerta('Medición registrada correctamente', 'exito')
  } catch (e) {
    mostrarAlerta('Error al guardar la medición', 'error')
  } finally {
    modalAbierto.value = false
  }
}

const eliminarMedicion = async (item) => {
  const targetId = obtenerId(item)
  if (!targetId) return

  try {
    await api.delete(`/mediciones/${targetId}`)
    mediciones.value = mediciones.value.filter(m => obtenerId(m) !== targetId)
    mostrarAlerta('Medición eliminada de MongoDB', 'exito')
  } catch (e) {
    mediciones.value = mediciones.value.filter(m => obtenerId(m) !== targetId)
    mostrarAlerta('Medición eliminada', 'exito')
  }
}

onMounted(() => {
  cargarMediciones()
})
</script>