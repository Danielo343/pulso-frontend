<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Contactos de Emergencia</h1>
        <p class="text-sm text-gray-500 mt-1">Red de apoyo y familiares guardados en MongoDB Atlas.</p>
      </div>
      <button @click="abrirModal()" class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
        + Nuevo Contacto
      </button>
    </div>

    <!-- Alerta -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">Cargando contactos...</div>
      <div v-else-if="contactos.length === 0" class="text-center py-8 text-gray-500 text-sm">No hay contactos de emergencia registrados.</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(item, idx) in contactos" :key="item.id || idx" class="p-4 border rounded-lg bg-gray-50 space-y-3 relative group">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-gray-800 text-base">{{ item.nombre }}</h3>
              <span class="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">{{ item.relacion }}</span>
            </div>
            <!-- Botones de Acción (Editar / Eliminar) -->
            <div class="flex space-x-1">
              <button @click="abrirModal(item)" class="p-1 text-gray-500 hover:text-blue-600 text-xs bg-white border rounded shadow-sm" title="Editar">
                ✏️
              </button>
              <button @click="eliminarContacto(item.id)" class="p-1 text-gray-500 hover:text-red-600 text-xs bg-white border rounded shadow-sm" title="Eliminar">
                🗑️
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-600 flex items-center space-x-1">
            <span>📞 {{ item.telefono }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Formulario (Crear / Editar) -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800">
          {{ modoEdicion ? 'Editar Contacto de Emergencia' : 'Agregar Contacto de Emergencia' }}
        </h3>
        <form @submit.prevent="guardarContacto" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: Maria González" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Parentezco / Relación</label>
            <input v-model="form.relacion" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: Hija, Médico Familiar" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.telefono" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="3312345678" />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="cerrarModal" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" :disabled="cargandoGuardado" class="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ cargandoGuardado ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar Contacto') }}
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

const contactos = ref([])
const cargando = ref(true)
const cargandoGuardado = ref(false)
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const contactoIdSeleccionado = ref(null)

const mensajeEstado = ref('')
const esError = ref(false)

const form = ref({ nombre: '', relacion: '', telefono: '' })

const abrirModal = (contacto = null) => {
  if (contacto) {
    modoEdicion.value = true
    contactoIdSeleccionado.value = contacto.id
    form.value = { nombre: contacto.nombre, relacion: contacto.relacion, telefono: contacto.telefono }
  } else {
    modoEdicion.value = false
    contactoIdSeleccionado.value = null
    form.value = { nombre: '', relacion: '', telefono: '' }
  }
  mostrarModal.value = true
}

const cerrarModal = () => {
  form.value = { nombre: '', relacion: '', telefono: '' }
  mostrarModal.value = false
  modoEdicion.value = false
  contactoIdSeleccionado.value = null
}

const cargarContactos = async () => {
  cargando.value = true
  try {
    const res = await api.get('/contactos')
    contactos.value = res.data
  } catch (err) {
    console.error('Error al cargar contactos:', err)
  } finally {
    cargando.value = false
  }
}

const guardarContacto = async () => {
  cargandoGuardado.value = true
  mensajeEstado.value = ''
  esError.value = false
  try {
    let res
    if (modoEdicion.value) {
      res = await api.put(`/contactos/${contactoIdSeleccionado.value}`, form.value)
      mensajeEstado.value = res.data.mensaje || 'Contacto actualizado con éxito'
    } else {
      res = await api.post('/contactos', form.value)
      mensajeEstado.value = res.data.mensaje || 'Contacto guardado con éxito'
    }
    cerrarModal()
    await cargarContactos()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al procesar la solicitud del contacto'
  } finally {
    cargandoGuardado.value = false
  }
}

const eliminarContacto = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este contacto de emergencia?')) return
  
  mensajeEstado.value = ''
  esError.value = false
  try {
    const res = await api.delete(`/contactos/${id}`)
    mensajeEstado.value = res.data.mensaje || 'Contacto eliminado con éxito'
    await cargarContactos()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al eliminar el contacto'
  }
}

onMounted(() => { cargarContactos() })
</script>