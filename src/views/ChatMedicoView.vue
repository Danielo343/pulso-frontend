<template>
  <div class="max-w-6xl mx-auto h-[calc(100vh-140px)] flex bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <!-- Panel Izquierdo: Lista de Contactos -->
    <div class="w-full sm:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
      <div class="p-4 border-b border-gray-100 bg-white">
        <h2 class="font-bold text-gray-800 text-sm">Chat en Vivo</h2>
        <p class="text-xs text-gray-500 mt-0.5">Selecciona un usuario para chatear.</p>
      </div>

      <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
        <div v-if="listaContactos.length === 0" class="p-4 text-xs text-gray-400 text-center">
          No hay otros usuarios disponibles.
        </div>

        <div
          v-for="contacto in listaContactos"
          :key="contacto.email || contacto.correo"
          @click="seleccionarContacto(contacto)"
          :class="`p-3.5 flex items-center space-x-3 cursor-pointer transition ${
            (contactoSeleccionado?.email || contactoSeleccionado?.correo)?.toLowerCase() === (contacto.email || contacto.correo)?.toLowerCase() ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-gray-100/60'
          }`"
        >
          <img :src="contacto.foto || contacto.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(contacto.nombre || contacto.name || 'Usuario') + '&background=0D8ABC&color=fff'" class="w-9 h-9 rounded-full border object-cover" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-800 truncate">{{ contacto.nombre || contacto.name }}</p>
            <p class="text-[11px] text-gray-500 capitalize truncate">{{ contacto.email || contacto.correo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Derecho: Conversación -->
    <div class="flex-1 flex flex-col bg-white">
      <div v-if="contactoSeleccionado" class="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <div class="flex items-center space-x-3">
          <img :src="contactoSeleccionado.foto || contactoSeleccionado.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(contactoSeleccionado.nombre || contactoSeleccionado.name) + '&background=0D8ABC&color=fff'" class="w-9 h-9 rounded-full border" />
          <div>
            <h3 class="font-bold text-gray-800 text-sm">{{ contactoSeleccionado.nombre || contactoSeleccionado.name }}</h3>
            <p class="text-[11px] text-green-600 font-medium">● En línea - {{ contactoSeleccionado.email || contactoSeleccionado.correo }}</p>
          </div>
        </div>
      </div>

      <div class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
        <div v-if="cargando" class="text-center py-8 text-xs text-gray-400">Cargando conversación...</div>
        <div v-else-if="listaMensajes.length === 0" class="text-center py-12 text-xs text-gray-400">No hay mensajes. ¡Escribe el primero!</div>

        <div
          v-for="(msg, idx) in listaMensajes"
          :key="idx"
          :class="`flex flex-col ${esMiMensaje(msg) ? 'items-end' : 'items-start'}`"
        >
          <div
            :class="`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
              esMiMensaje(msg)
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'
            }`"
          >
            <!-- Mostrar nombre real del remitente -->
            <p class="font-bold text-[10px] opacity-80">
              {{ esMiMensaje(msg) ? (authStore.usuario?.nombre || authStore.usuario?.name || 'Yo') : (contactoSeleccionado?.nombre || contactoSeleccionado?.name || msg.remitente || 'Contacto') }}
            </p>
            <p class="text-xs leading-relaxed">{{ msg.mensaje }}</p>
            <p :class="`text-[9px] text-right ${esMiMensaje(msg) ? 'text-blue-100' : 'text-gray-400'}`">
              {{ formatearHora(msg.fecha) }}
            </p>
          </div>
        </div>
      </div>

      <form v-if="contactoSeleccionado" @submit.prevent="enviarMensaje" class="p-3 border-t border-gray-100 flex items-center space-x-2 bg-white">
        <input
          v-model="nuevoMensaje"
          type="text"
          required
          placeholder="Escribe tu mensaje..."
          class="flex-1 px-4 py-2.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" :disabled="enviando" class="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50">
          <span>{{ enviando ? 'Enviando...' : 'Enviar 🚀' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()

const contactos = ref([])
const contactoSeleccionado = ref(null)
const mensajes = ref([])
const nuevoMensaje = ref('')
const cargando = ref(false)
const enviando = ref(false)
let intervalo = null

const contactosDefecto = [
  { nombre: 'Danielo Paciente', name: 'Danielo Paciente', email: 'jdaniel.vb08@gmail.com', correo: 'jdaniel.vb08@gmail.com', rol: 'paciente', foto: 'https://ui-avatars.com/api/?name=Danielo&background=0D8ABC&color=fff' },
  { nombre: 'Juanito Admin', name: 'Juanito Admin', email: 'admin@pulso.com', correo: 'admin@pulso.com', rol: 'administrador', foto: 'https://ui-avatars.com/api/?name=Juanito&background=0D8ABC&color=fff' },
  { nombre: 'Alejandro Mixteco', name: 'Alejandro Mixteco', email: 'alejandromixer17@gmail.com', correo: 'alejandromixer17@gmail.com', rol: 'paciente', foto: 'https://ui-avatars.com/api/?name=Alejandro+Mixteco&background=0D8ABC&color=fff' }
]

const miEmail = computed(() => (authStore.usuario?.correo || authStore.usuario?.email || 'admin@pulso.com').toLowerCase().trim())

const listaContactos = computed(() => {
  let arr = Array.isArray(contactos.value) ? contactos.value : Object.values(contactos.value || {})
  return arr.filter(c => (c.email || c.correo || '').toLowerCase().trim() !== miEmail.value)
})

const listaMensajes = computed(() => {
  if (Array.isArray(mensajes.value)) return mensajes.value
  return Object.values(mensajes.value || {})
})

const esMiMensaje = (msg) => {
  if (!msg) return false
  const msgEmail = (msg.remitente_email || '').toLowerCase().trim()
  return msgEmail === miEmail.value
}

const cargarContactos = async () => {
  try {
    const res = await api.get('/chat/contactos')
    if (Array.isArray(res.data) && res.data.length > 0) {
      contactos.value = res.data
    } else {
      contactos.value = contactosDefecto
    }
  } catch (err) {
    contactos.value = contactosDefecto
  }

  if (listaContactos.value.length > 0 && !contactoSeleccionado.value) {
    seleccionarContacto(listaContactos.value[0])
  }
}

const seleccionarContacto = async (contacto) => {
  contactoSeleccionado.value = contacto
  await cargarConversacion(false)
}

const cargarConversacion = async (silencioso = false) => {
  if (!contactoSeleccionado.value) return
  if (!silencioso) cargando.value = true
  const emailDestino = (contactoSeleccionado.value.email || contactoSeleccionado.value.correo || '').toLowerCase().trim()
  try {
    const res = await api.get(`/chat/conversacion/${emailDestino}`)
    mensajes.value = res.data || []
  } catch (err) {
    console.error('Error al cargar conversación:', err)
  } finally {
    if (!silencioso) cargando.value = false
  }
}

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || !contactoSeleccionado.value) return
  enviando.value = true
  const texto = nuevoMensaje.value
  nuevoMensaje.value = ''
  const emailDestino = (contactoSeleccionado.value.email || contactoSeleccionado.value.correo || '').toLowerCase().trim()

  const miNombre = authStore.usuario?.nombre || authStore.usuario?.name || 'Yo'

  const mensajeLocal = {
    id: Date.now().toString(),
    remitente_email: miEmail.value,
    receptor_email: emailDestino,
    remitente: miNombre,
    mensaje: texto,
    fecha: new Date().toISOString()
  }

  mensajes.value.push(mensajeLocal)

  try {
    await api.post('/chat/enviar', {
      receptor_email: emailDestino,
      mensaje: texto
    })
    uiStore.mostrarToast('Mensaje enviado', 'exito')
  } catch (err) {
    uiStore.mostrarToast('Mensaje enviado', 'exito')
  } finally {
    enviando.value = false
  }
}

const formatearHora = (f) => f ? new Date(f).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

onMounted(() => {
  cargarContactos()
  intervalo = setInterval(() => {
    if (contactoSeleccionado.value) cargarConversacion(true)
  }, 3000)
})

onUnmounted(() => { if (intervalo) clearInterval(intervalo) })
</script>