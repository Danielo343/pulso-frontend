<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios y Roles</h1>
        <p class="text-sm text-gray-500 mt-1">Administra accesos y permisos de administradores, pacientes y cuidadores.</p>
      </div>
      <button @click="abrirModalCrear" class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
        + Nuevo Usuario
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 justify-between">
      <input v-model="busqueda" type="text" placeholder="Buscar por nombre o correo..." class="px-3 py-2 border rounded-lg text-sm w-full sm:w-64" />
      <select v-model="filtroRol" class="px-3 py-2 border rounded-lg text-sm bg-white">
        <option value="">Todos los roles</option>
        <option value="administrador">Administrador</option>
        <option value="paciente">Paciente</option>
        <option value="cuidador">Cuidador</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
            <th class="py-3 px-4">Usuario</th>
            <th class="py-3 px-4">Rol Asignado</th>
            <th class="py-3 px-4">Teléfono</th>
            <th class="py-3 px-4">Estado</th>
            <th class="py-3 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm">
          <tr v-for="u in usuariosFiltrados" :key="u.email || u._id" class="hover:bg-gray-50/50">
            <td class="py-3 px-4 flex items-center space-x-3">
              <img :src="u.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.nombre || u.name || 'Usuario') + '&background=0D8ABC&color=fff'" class="w-9 h-9 rounded-full object-cover border" />
              <div>
                <p class="font-medium text-gray-800">{{ u.nombre || u.name }}</p>
                <p class="text-xs text-gray-500">{{ u.email }}</p>
              </div>
            </td>
            <td class="py-3 px-4">
              <span :class="`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                u.rol === 'administrador' ? 'bg-purple-100 text-purple-800' :
                u.rol === 'cuidador' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`">
                {{ u.rol || 'paciente' }}
              </span>
            </td>
            <td class="py-3 px-4 text-gray-600">{{ u.telefono || 'Sin teléfono' }}</td>
            <td class="py-3 px-4">
              <span class="inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 capitalize">
                {{ u.estado || 'activo' }}
              </span>
            </td>
            <td class="py-3 px-4 text-right space-x-2">
              <button @click="abrirModalEditar(u)" class="text-blue-600 hover:text-blue-800 text-xs font-semibold">Editar / Rol</button>
              <button @click="eliminarUsuario(u.email || u._id)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800">{{ modoEdicion ? 'Editar Usuario / Cambiar Rol' : 'Nuevo Usuario' }}</h3>
        <form @submit.prevent="guardarUsuario" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div v-if="!modoEdicion">
            <label class="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Rol Asignado</label>
            <select v-model="form.rol" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
              <option value="administrador">Administrador</option>
              <option value="paciente">Paciente / Adulto Mayor</option>
              <option value="cuidador">Cuidador / Familiar</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.telefono" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="mostrarModal = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const usuarios = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const usuarioTarget = ref(null)

const busqueda = ref('')
const filtroRol = ref('')
const mensajeEstado = ref('')
const esError = ref(false)

const form = ref({ nombre: '', email: '', rol: 'paciente', telefono: '' })

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    const coinc = (u.nombre || u.name || '').toLowerCase().includes(busqueda.value.toLowerCase()) ||
                  (u.email || '').toLowerCase().includes(busqueda.value.toLowerCase())
    const coincRol = !filtroRol.value || u.rol === filtroRol.value
    return coinc && coincRol
  })
})

const cargarUsuarios = async () => {
  try {
    const res = await api.get('/usuarios')
    usuarios.value = res.data || []
  } catch (err) {
    console.error(err)
  }
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  form.value = { nombre: '', email: '', rol: 'paciente', telefono: '' }
  mostrarModal.value = true
}

const abrirModalEditar = (u) => {
  modoEdicion.value = true
  usuarioTarget.value = u.email || u._id
  form.value = {
    nombre: u.nombre || u.name || '',
    email: u.email || '',
    rol: u.rol || 'paciente',
    telefono: u.telefono || ''
  }
  mostrarModal.value = true
}

const guardarUsuario = async () => {
  try {
    if (modoEdicion.value) {
      await api.put(`/usuarios/${usuarioTarget.value}`, form.value)
      mensajeEstado.value = 'Usuario actualizado exitosamente'
    } else {
      await api.post('/usuarios', form.value)
      mensajeEstado.value = 'Usuario creado exitosamente'
    }
    mostrarModal.value = false
    await cargarUsuarios()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al guardar el usuario'
  }
}

const eliminarUsuario = async (key) => {
  if (!confirm('¿Seguro que deseas eliminar a este usuario?')) return
  try {
    await api.delete(`/usuarios/${key}`)
    mensajeEstado.value = 'Usuario eliminado exitosamente'
    await cargarUsuarios()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al eliminar'
  }
}

onMounted(() => { cargarUsuarios() })
</script>