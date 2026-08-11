<template>
  <div class="space-y-6">
    <!-- Banner de Alerta / Notificación -->
    <div
      v-if="alerta.mostrar"
      :class="[
        'p-4 rounded-xl flex items-center justify-between transition-all duration-300 shadow-sm border',
        alerta.tipo === 'exito'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-rose-50 text-rose-800 border-rose-200'
      ]"
    >
      <div class="flex items-center space-x-2">
        <svg v-if="alerta.tipo === 'exito'" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ alerta.mensaje }}</span>
      </div>
      <button @click="alerta.mostrar = false" class="text-gray-400 hover:text-gray-600">
        <span class="text-xl">&times;</span>
      </button>
    </div>

    <!-- Encabezado de la Sección -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Medicamentos</h1>
        <p class="text-sm text-gray-500">Gestión y seguimiento de tratamiento</p>
      </div>
      <button
        @click="abrirModalNuevo"
        class="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors space-x-2"
      >
        <span class="text-lg font-bold">+</span>
        <span>Agregar Medicamento</span>
      </button>
    </div>

    <!-- Métricas KPI -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Hoy</p>
          <p class="text-3xl font-extrabold text-gray-900 mt-1">{{ kpis.total }}</p>
        </div>
        <div class="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl">
          💊
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completados</p>
          <p class="text-3xl font-extrabold text-emerald-600 mt-1">{{ kpis.completados }}</p>
        </div>
        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold">
          ✓
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pendientes</p>
          <p class="text-3xl font-extrabold text-amber-500 mt-1">{{ kpis.pendientes }}</p>
        </div>
        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold">
          ⚠️
        </div>
      </div>
    </div>

    <!-- Layout Principal: Calendario e Historial -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendario Interactivo -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Calendario de Medicamentos</h2>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ mesActualNombre }} {{ anioActual }} — Día Seleccionado:
              <span class="font-bold text-blue-600">Día {{ diaSeleccionado }}</span>
            </p>
          </div>
          <span class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium hidden sm:inline-block">
            Pasa el cursor para ver la agenda
          </span>
        </div>

        <!-- Encabezados Días de la Semana -->
        <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-3">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>

        <!-- Rejilla de Días -->
        <div class="grid grid-cols-7 gap-2">
          <!-- Offset de días vacíos -->
          <div
            v-for="blank in primerDiaOffset"
            :key="'blank-' + blank"
            class="h-16 sm:h-20 rounded-xl bg-gray-50/50 border border-transparent"
          ></div>

          <!-- Días del Mes -->
          <div
            v-for="dia in diasDelMes"
            :key="dia"
            @click="diaSeleccionado = dia"
            @mouseenter="diaHover = dia"
            @mouseleave="diaHover = null"
            :class="[
              'h-16 sm:h-20 rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all relative',
              diaSeleccionado === dia
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 ring-2 ring-blue-300'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
            ]"
          >
            <span class="text-xs sm:text-sm font-bold">{{ dia }}</span>

            <!-- Indicadores Visuales -->
            <div class="flex items-center justify-center space-x-1 mt-auto">
              <template v-for="(med, idx) in obtenerMedicamentosParaDia(dia)" :key="idx">
                <span
                  v-for="(hora, hIdx) in med.horas"
                  :key="`${idx}-${hIdx}`"
                  :class="[
                    'w-2 h-2 rounded-full inline-block',
                    estaTomaCompletada(dia, med.nombre, hora)
                      ? (diaSeleccionado === dia ? 'bg-emerald-300' : 'bg-emerald-500')
                      : (diaSeleccionado === dia ? 'bg-amber-300' : 'bg-amber-500')
                  ]"
                ></span>
              </template>
            </div>

            <!-- Tooltip Hover de Agenda Día -->
            <div
              v-if="diaHover === dia && obtenerMedicamentosParaDia(dia).length > 0"
              class="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 pointer-events-none"
            >
              <p class="font-bold border-b border-slate-700 pb-1 mb-2 text-slate-300">
                Agenda Día {{ dia }}
              </p>
              <div class="space-y-1">
                <template v-for="med in obtenerMedicamentosParaDia(dia)" :key="obtenerId(med)">
                  <div v-for="hora in med.horas" :key="hora" class="flex items-center justify-between text-emerald-400 font-medium">
                    <span>💊 {{ med.nombre }} {{ med.dosis }}</span>
                    <span class="text-slate-400 text-[10px]">({{ hora }})</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Tratamientos Agendados e Historial del Día -->
      <div class="space-y-6">
        <!-- Lista de Tratamientos Agendados -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Tratamientos Agendados</h2>

          <div v-if="medicamentos.length === 0" class="text-center py-8 text-gray-400 text-sm">
            No hay tratamientos registrados.
          </div>

          <div class="space-y-3">
            <div
              v-for="med in medicamentos"
              :key="obtenerId(med)"
              class="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200/60 flex items-center justify-between transition-colors group"
            >
              <div class="pr-2">
                <p class="font-bold text-gray-900 text-sm">{{ med.nombre }} {{ med.dosis }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ med.unidad }} {{ med.instrucciones ? '• ' + med.instrucciones : '' }}
                </p>

                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span
                    v-for="hora in med.horas"
                    :key="hora"
                    class="text-[11px] font-semibold bg-white text-gray-700 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs"
                  >
                    {{ hora }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-1 opacity-90 group-hover:opacity-100">
                <button
                  @click="abrirModalEditar(med)"
                  class="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Editar Medicamento"
                >
                  ✏️
                </button>
                <button
                  @click="eliminarMedicamento(med)"
                  class="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Eliminar Medicamento"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial / Estado del Día Seleccionado -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 class="text-lg font-bold text-gray-900 mb-4">
            Historial del Día {{ diaSeleccionado }}
          </h2>

          <div v-if="obtenerMedicamentosParaDia(diaSeleccionado).length === 0" class="text-center py-6 text-gray-400 text-xs">
            Sin tomas programadas para este día.
          </div>

          <div class="space-y-3">
            <template v-for="med in obtenerMedicamentosParaDia(diaSeleccionado)" :key="obtenerId(med)">
              <div
                v-for="hora in med.horas"
                :key="hora"
                class="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p class="font-semibold text-gray-800 text-xs">{{ med.nombre }} {{ med.dosis }}</p>
                  <p class="text-[11px] text-gray-500">
                    Programado: <span class="font-medium text-gray-700">{{ hora }}</span>
                  </p>
                </div>
                <button
                  @click="alternarEstadoToma(diaSeleccionado, med.nombre, hora)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1',
                    estaTomaCompletada(diaSeleccionado, med.nombre, hora)
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  ]"
                >
                  <span>{{ estaTomaCompletada(diaSeleccionado, med.nombre, hora) ? '✓ Tomado' : '⏳ Pendiente' }}</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Estricto para Agregar / Editar Medicamento -->
    <div v-if="modal.abierto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <h3 class="text-lg font-bold text-gray-900">
            {{ modal.esEdicion ? 'Editar Medicamento' : 'Agregar Medicamento' }}
          </h3>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form @submit.prevent="guardarMedicamento" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre del Medicamento</label>
            <input
              v-model="formulario.nombre"
              list="catalogo-medicamentos"
              type="text"
              required
              placeholder="Ej. Losartán, Metformina, Paracetamol..."
              class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <datalist id="catalogo-medicamentos">
              <option value="Losartán"></option>
              <option value="Metformina"></option>
              <option value="Paracetamol"></option>
              <option value="Omeprazol"></option>
              <option value="Captopril"></option>
              <option value="Atorvastatina"></option>
              <option value="Amlodipino"></option>
              <option value="Aspirina"></option>
            </datalist>
          </div>

          <!-- Dosis y Unidad -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Dosis / Cantidad</label>
              <input
                v-model="formulario.dosis"
                type="text"
                required
                placeholder="Ej. 1, 2, 500"
                class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Unidad</label>
              <select
                v-model="formulario.unidad"
                class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="tableta(s)">tableta(s)</option>
                <option value="cápsula(s)">cápsula(s)</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="gotas">gotas</option>
                <option value="sobres">sobres</option>
                <option value="inyección">inyección</option>
              </select>
            </div>
          </div>

          <!-- Instrucciones -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Instrucciones</label>
            <select
              v-model="formulario.instrucciones"
              class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Con alimentos">Con alimentos</option>
              <option value="En ayunas">En ayunas</option>
              <option value="Antes de dormir">Antes de dormir</option>
              <option value="Después de comer">Después de comer</option>
              <option value="Con suficiente agua">Con suficiente agua</option>
              <option value="Sin indicaciones especiales">Sin indicaciones especiales</option>
            </select>
          </div>

          <!-- Frecuencia -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Frecuencia de Toma</label>
            <select
              v-model="formulario.tipoFrecuencia"
              @change="actualizarDiasPorFrecuencia"
              class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2"
            >
              <option value="diario">Todos los días (Diario)</option>
              <option value="especifico">Días específicos de la semana</option>
            </select>

            <div v-if="formulario.tipoFrecuencia === 'especifico'" class="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                v-for="diaSem in diasSemanaOpciones"
                :key="diaSem.clave"
                @click="alternarDiaFormulario(diaSem.clave)"
                :class="[
                  'px-2.5 py-1 text-xs rounded-lg font-semibold border transition-colors',
                  formulario.dias.includes(diaSem.clave)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                ]"
              >
                {{ diaSem.etiqueta }}
              </button>
            </div>
          </div>

          <!-- Horarios -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-gray-700 uppercase">Horarios de Toma</label>
              <button
                type="button"
                @click="agregarHorarioFormulario"
                class="text-xs text-blue-600 font-bold hover:underline"
              >
                + Agregar Horario
              </button>
            </div>

            <div class="space-y-2 max-h-32 overflow-y-auto pr-1">
              <div
                v-for="(horaObj, idx) in formulario.horasLista"
                :key="idx"
                class="flex items-center space-x-2"
              >
                <input
                  type="time"
                  v-model="horaObj.valor"
                  required
                  class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  v-if="formulario.horasLista.length > 1"
                  type="button"
                  @click="removerHorarioFormulario(idx)"
                  class="text-rose-500 hover:text-rose-700 p-1 font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              @click="cerrarModal"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              Guardar
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

// Estado reactivo principal
const medicamentos = ref([])
const diaSeleccionado = ref(new Date().getDate())
const diaHover = ref(null)

const anioActual = ref(new Date().getFullYear())
const mesActualIndex = ref(new Date().getMonth())
const mesActualNombre = computed(() => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return meses[mesActualIndex.value]
})

const tomasRegistradas = ref({})

const alerta = ref({ mostrar: false, mensaje: '', tipo: 'exito' })
const mostrarAlerta = (msg, tipo = 'exito') => {
  alerta.value = { mostrar: true, mensaje: msg, tipo }
  setTimeout(() => { alerta.value.mostrar = false }, 4000)
}

const obtenerId = (item) => String(item._id || item.id || '')

// Cargar únicamente datos reales de MongoDB sin reinyecciones
const cargarMedicamentos = async () => {
  try {
    const respuesta = await api.get('/medicamentos')
    const datos = respuesta.data?.data || respuesta.data || []
    if (Array.isArray(datos)) {
      medicamentos.value = datos.map(item => ({
        ...item,
        id: obtenerId(item),
        _id: obtenerId(item)
      }))
    }
  } catch (error) {
    console.warn('Error al conectar con la API de medicamentos:', error)
  }
}

const diasDelMes = computed(() => {
  const cantidad = new Date(anioActual.value, mesActualIndex.value + 1, 0).getDate()
  return Array.from({ length: cantidad }, (_, i) => i + 1)
})

const primerDiaOffset = computed(() => {
  return new Date(anioActual.value, mesActualIndex.value, 1).getDay()
})

const obtenerNombreDiaSemana = (dia) => {
  const fecha = new Date(anioActual.value, mesActualIndex.value, dia)
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  return dias[fecha.getDay()]
}

const obtenerMedicamentosParaDia = (dia) => {
  const diaSemana = obtenerNombreDiaSemana(dia)
  return medicamentos.value.filter(med => {
    if (!med.dias || med.dias.length === 0) return true
    const diasNormalizados = med.dias.map(d => String(d).toLowerCase())
    return (
      diasNormalizados.includes(diaSemana) ||
      diasNormalizados.includes('todos') ||
      diasNormalizados.includes('diario')
    )
  })
}

const keyToma = (dia, nombreMed, hora) => `${dia}-${nombreMed}-${hora}`

const estaTomaCompletada = (dia, nombreMed, hora) => {
  return !!tomasRegistradas.value[keyToma(dia, nombreMed, hora)]
}

const alternarEstadoToma = (dia, nombreMed, hora) => {
  const k = keyToma(dia, nombreMed, hora)
  tomasRegistradas.value[k] = !tomasRegistradas.value[k]
}

const kpis = computed(() => {
  const medsHoy = obtenerMedicamentosParaDia(diaSeleccionado.value)
  let totalDosis = 0
  let completadas = 0

  medsHoy.forEach(med => {
    (med.horas || []).forEach(hora => {
      totalDosis++
      if (estaTomaCompletada(diaSeleccionado.value, med.nombre, hora)) {
        completadas++
      }
    })
  })

  return {
    total: totalDosis,
    completados: completadas,
    pendientes: Math.max(0, totalDosis - completadas)
  }
})

const modal = ref({ abierto: false, esEdicion: false, idEdicion: null })

const diasSemanaOpciones = [
  { clave: 'lunes', etiqueta: 'Lun' },
  { clave: 'martes', etiqueta: 'Mar' },
  { clave: 'miércoles', etiqueta: 'Mié' },
  { clave: 'jueves', etiqueta: 'Jue' },
  { clave: 'viernes', etiqueta: 'Vie' },
  { clave: 'sábado', etiqueta: 'Sáb' },
  { clave: 'domingo', etiqueta: 'Dom' }
]

const formulario = ref({
  nombre: '',
  dosis: '',
  unidad: 'tableta(s)',
  instrucciones: 'Con alimentos',
  tipoFrecuencia: 'diario',
  dias: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
  horasLista: [{ valor: '08:00' }]
})

const abrirModalNuevo = () => {
  modal.value = { abierto: true, esEdicion: false, idEdicion: null }
  formulario.value = {
    nombre: '',
    dosis: '1',
    unidad: 'tableta(s)',
    instrucciones: 'Con alimentos',
    tipoFrecuencia: 'diario',
    dias: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    horasLista: [{ valor: '08:00' }]
  }
}

const abrirModalEditar = (med) => {
  const targetId = obtenerId(med)
  modal.value = { abierto: true, esEdicion: true, idEdicion: targetId }

  const esDiario = !med.dias || med.dias.length >= 7
  formulario.value = {
    nombre: med.nombre || '',
    dosis: med.dosis || '',
    unidad: med.unidad || 'tableta(s)',
    instrucciones: med.instrucciones || 'Sin indicaciones especiales',
    tipoFrecuencia: esDiario ? 'diario' : 'especifico',
    dias: med.dias ? [...med.dias] : ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    horasLista: (med.horas && med.horas.length > 0)
      ? med.horas.map(h => ({ valor: h }))
      : [{ valor: '08:00' }]
  }
}

const cerrarModal = () => {
  modal.value.abierto = false
}

const actualizarDiasPorFrecuencia = () => {
  if (formulario.value.tipoFrecuencia === 'diario') {
    formulario.value.dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
  } else if (formulario.value.dias.length === 7) {
    formulario.value.dias = ['lunes', 'miércoles', 'viernes']
  }
}

const alternarDiaFormulario = (diaClave) => {
  const idx = formulario.value.dias.indexOf(diaClave)
  if (idx > -1) {
    if (formulario.value.dias.length > 1) {
      formulario.value.dias.splice(idx, 1)
    }
  } else {
    formulario.value.dias.push(diaClave)
  }
}

const agregarHorarioFormulario = () => {
  formulario.value.horasLista.push({ valor: '12:00' })
}

const removerHorarioFormulario = (idx) => {
  if (formulario.value.horasLista.length > 1) {
    formulario.value.horasLista.splice(idx, 1)
  }
}

const formatearHora = (horaRaw) => {
  if (!horaRaw) return '08:00'
  const h = String(horaRaw).trim()
  if (h.includes(':')) {
    const [p1, p2] = h.split(':')
    return `${p1.padStart(2, '0')}:${p2.padEnd(2, '0').slice(0, 2)}`
  }
  const num = parseInt(h, 10)
  if (!isNaN(num)) {
    return `${String(num).padStart(2, '0')}:00`
  }
  return h
}

const guardarMedicamento = async () => {
  const horasFormateadas = formulario.value.horasLista
    .map(h => formatearHora(h.valor))
    .filter(Boolean)

  const payload = {
    nombre: formulario.value.nombre.trim(),
    dosis: formulario.value.dosis.trim(),
    unidad: formulario.value.unidad,
    instrucciones: formulario.value.instrucciones,
    frecuencia: formulario.value.tipoFrecuencia === 'diario' ? 'Diario' : 'Días específicos',
    dias: formulario.value.dias,
    horas: horasFormateadas
  }

  try {
    if (modal.value.esEdicion) {
      const id = modal.value.idEdicion
      const res = await api.put(`/medicamentos/${id}`, payload)
      const medicamentoActualizado = res.data?.data || { ...payload, _id: id, id }

      const idx = medicamentos.value.findIndex(m => obtenerId(m) === id)
      if (idx !== -1) {
        medicamentos.value[idx] = { ...medicamentoActualizado, _id: id, id }
      }
      mostrarAlerta('Medicamento actualizado correctamente', 'exito')
    } else {
      const res = await api.post('/medicamentos', payload)
      const nuevoMedicamento = res.data?.data || {
        ...payload,
        _id: String(Date.now()),
        id: String(Date.now())
      }

      medicamentos.value.push({
        ...nuevoMedicamento,
        _id: obtenerId(nuevoMedicamento),
        id: obtenerId(nuevoMedicamento)
      })
      mostrarAlerta('Medicamento agendado correctamente', 'exito')
    }
  } catch (error) {
    mostrarAlerta('Error al guardar el medicamento en el servidor', 'error')
  } finally {
    cerrarModal()
  }
}

// Eliminar medicamento de MongoDB y actualizar la vista reactiva
const eliminarMedicamento = async (med) => {
  const targetId = obtenerId(med)
  if (!targetId) return

  try {
    await api.delete(`/medicamentos/${targetId}`)
    medicamentos.value = medicamentos.value.filter(m => obtenerId(m) !== targetId)
    mostrarAlerta('Medicamento eliminado correctamente de MongoDB Atlas', 'exito')
  } catch (error) {
    medicamentos.value = medicamentos.value.filter(m => obtenerId(m) !== targetId)
    mostrarAlerta('Medicamento eliminado de la lista', 'exito')
  }
}

onMounted(() => {
  cargarMedicamentos()
})
</script>