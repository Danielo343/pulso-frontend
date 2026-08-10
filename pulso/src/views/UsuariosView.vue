<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios y Roles</h1>
        <p class="text-sm text-gray-500 mt-1">Administra los accesos de administradores, pacientes y cuidadores.</p>
      </div>
      <button
        @click="abrirModalCrear"
        class="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition flex items-center justify-center space-x-2"
      >
        <span>+ Nuevo Usuario</span>
      </button>
    </div>

    <!-- Alertas de Estado -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <!-- Barra de Búsqueda y Filtro de Roles -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 justify-between">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre o correo..."
        class="px-3 py-2 border rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
      />
      
      <select v-model="filtroRol" class="px-3 py-2 border rounded-lg text-sm w-full sm:w-48 bg-white">
        <option value="">Todos los roles</option>
        <option value="administrador">Administrador</option>
        <option value="paciente">Paciente / Adulto Mayor</option>
        <option value="cuidador">Cuidador / Familiar</option>
      </select>
    </div>

    <!-- Tabla de Usuarios -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="cargando" class="text-center py-12 text-gray-500 text-sm">
        Cargando usuarios desde MongoDB Atlas...
      </div>

      <div v-else-if="usuariosFiltrados.length === 0" class="text-center py-12 text-gray-500 text-sm">
        No se encontraron usuarios registrados.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="py-3 px-4">Usuario</th>
              <th class="py-3 px-4">Rol Asignado</th>
              <th class="py-3 px-4">Teléfono</th>
              <th class="py-3 px-4">Estado</th>
              <th class="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="user in usuariosFiltrados" :key="user._id || user.id" class="hover:bg-gray-50/50">
              <td class="py-3 px-4 flex items-center space-x-3">
                <img :src="user.foto || user.avatar || 'https://ui-avatars.com/api/?name=' + urlencode(user.nombre || user.name)" class="w-9 h-9 rounded-full object-cover border" />
                <div>
                  <p class="font-medium text-gray-800">{{ user.nombre || user.name }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
              </td>

              <td class="py-3 px-4">
                <span :class="`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                  user.rol === 'administrador' ? 'bg-purple-100 text-purple-800' :
                  user.rol === 'cuidador' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`">
                  {{ user.rol || 'paciente' }}
                </span>
              </td>

              <td class="py-3 px-4 text-gray-600">{{ user.telefono || 'Sin teléfono' }}</td>

              <td class="py-3 px-4">
                <span :class="`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                  user.estado === 'inactivo' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`">
                  {{ user.estado || 'activo' }}
                </span>
              </td>

              <td class="py-3 px-4 text-right space-x-2">
                <button @click="abrirModalEditar(user)" class="text-blue-600 hover:text-blue-800 text-xs font-semibold">Editar / Rol</button>
                <button @click="eliminarUsuario(user._id || user.id)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800">{{ modoEdicion ? 'Editar Usuario / Rol' : 'Nuevo Usuario' }}</h3>

        <form @submit.prevent="guardarUsuario" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ej: Juan Pérez" />
          </div>

          <div v-if="!modoEdicion">
            <label class="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="usuario@pulso.com" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Rol del Sistema</label>
            <select v-model="form.rol" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
              <option value="administrador">Administrador</option>
              <option value="paciente">Paciente / Adulto Mayor</option>
              <option value="cuidador">Cuidador / Familiar</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.telefono" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="3312345678" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">{{ modoEdicion ? 'Nueva Contraseña (Opcional)' : 'Contraseña' }}</label>
            <input v-model="form.password" type="password" :required="!modoEdicion" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="••••••••" />
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="mostrarModal = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              {{ modoEdicion ? 'Guardar Cambios' : 'Crear Usuario' }}
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

const usuarios = ref([])
const cargando = ref(true)
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const usuarioIdEdicion = ref(null)

const busqueda = ref('')
const filtroRol = ref('')
const mensajeEstado = ref('')
const esError = ref(false)

const form = ref({
  nombre: '',
  email: '',
  rol: 'paciente',
  telefono: '',
  password: ''
})

const urlencode = (str) => encodeURIComponent(str || 'Usuario')

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    const coincideNombre = (u.nombre || u.name || '').toLowerCase().includes(busqueda.value.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideRol = !filtroRol.value || u.rol === filtroRol.value
    return coincideNombre && coincideRol
  })
})

const cargarUsuarios = async () => {
  cargando.value = true
  try {
    const res = await api.get('/usuarios')
    usuarios.value = res.data
  } catch (err) {
    console.error('Error al cargar usuarios:', err)
  } finally {
    cargando.value = false
  }
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  usuarioIdEdicion.value = null
  form.value = { nombre: '', email: '', rol: 'paciente', telefono: '', password: '' }
  mostrarModal.value = true
}

const abrirModalEditar = (usuario) => {
  modoEdicion.value = true
  usuarioIdEdicion.value = usuario._id || usuario.id
  form.value = {
    nombre: usuario.nombre || usuario.name || '',
    email: usuario.email || '',
    rol: usuario.rol || 'paciente',
    telefono: usuario.telefono || '',
    password: ''
  }
  mostrarModal.value = true
}

const guardarUsuario = async () => {
  mensajeEstado.value = ''
  esError.value = false
  try {
    if (modoEdicion.value) {
      await api.put(`/usuarios/${usuarioIdEdicion.value}`, form.value)
      mensajeEstado.value = 'Usuario actualizado con éxito'
    } else {
      await api.post('/usuarios', form.value)
      mensajeEstado.value = 'Usuario creado con éxito'
    }
    mostrarModal.value = false
    await cargarUsuarios()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = err.response?.data?.mensaje || 'Error al guardar usuario'
  }
}

const eliminarUsuario = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return
  try {
    await api.delete(`/usuarios/${id}`)
    mensajeEstado.value = 'Usuario eliminado correctamente'
    await cargarUsuarios()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al eliminar el usuario'
  }
}

onMounted(() => {
  cargarUsuarios()
})
</script>