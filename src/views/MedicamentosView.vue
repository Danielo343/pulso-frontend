<template>
  <div class="space-y-6">
    <PageHeader
      title="Medicamentos"
      subtitle="Tratamientos activos y horarios de administración consultados desde MongoDB Atlas"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Medicamentos' }]"
    >
      <template #actions>
        <Button variant="primary" @click="abrirModal">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar medicamento
        </Button>
      </template>
    </PageHeader>

    <!-- Alerta de estado -->
    <div v-if="mensajeEstado" :class="`p-4 rounded-lg text-sm flex items-center justify-between ${esError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`">
      <span>{{ mensajeEstado }}</span>
      <button @click="mensajeEstado = ''" class="font-bold ml-4">&times;</button>
    </div>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar medicamento..." />
        <FilterBar :filters="[{ label: 'Paciente' }, { label: 'Estado' }]" />
      </div>

      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">Cargando medicamentos...</div>

      <Table v-else :columns="columns" :rows="medicamentosFiltrados">
        <template #cell-estado="{ value }">
          <Badge :variant="value === 'Activo' ? 'success' : 'neutral'">{{ value || 'Activo' }}</Badge>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="1" :total-items="medicamentos.length" />
    </Card>

    <Modal v-model="showModal" title="Agregar medicamento" size="md">
      <div class="space-y-4">
        <Input v-model="form.nombre" label="Nombre del medicamento" placeholder="Ej. Losartán 50mg" />
        <Input v-model="form.usuario" label="Paciente" placeholder="Buscar paciente o correo..." />
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.dosis" label="Dosis" placeholder="1 tableta" />
          <Input v-model="form.horario" label="Horario" placeholder="08:00 / 20:00" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" :disabled="cargandoGuardado" @click="guardarMedicamento">
          {{ cargandoGuardado ? 'Guardando...' : 'Guardar' }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import Badge from '@/components/common/Badge.vue'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import api from '@/services/api'

const search = ref('')
const showModal = ref(false)
const cargando = ref(true)
const cargandoGuardado = ref(false)
const mensajeEstado = ref('')
const esError = ref(false)

const medicamentos = ref([])

const form = ref({
  nombre: '',
  usuario: 'admin@pulso.com',
  dosis: '',
  horario: ''
})

const columns = [
  { key: 'nombre', label: 'Medicamento' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'dosis', label: 'Dosis' },
  { key: 'horario', label: 'Horario' },
  { key: 'estado', label: 'Estado', align: 'center' }
]

const cargarMedicamentos = async () => {
  cargando.value = true
  try {
    const res = await api.get('/medicamentos')
    medicamentos.value = res.data
  } catch (err) {
    console.error('Error al cargar medicamentos:', err)
  } finally {
    cargando.value = false
  }
}

const abrirModal = () => {
  form.value = { nombre: '', usuario: 'admin@pulso.com', dosis: '', horario: '' }
  showModal.value = true
}

const guardarMedicamento = async () => {
  if (!form.value.nombre || !form.value.dosis || !form.value.horario) {
    alert('Por favor completa los campos requeridos.')
    return
  }

  cargandoGuardado.value = true
  mensajeEstado.value = ''
  esError.value = false

  try {
    const res = await api.post('/medicamentos', form.value)
    mensajeEstado.value = res.data.mensaje || 'Medicamento registrado con éxito'
    showModal.value = false
    await cargarMedicamentos()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al registrar el medicamento'
  } finally {
    cargandoGuardado.value = false
  }
}

const medicamentosFiltrados = computed(() => {
  if (!search.value) return medicamentos.value
  const query = search.value.toLowerCase()
  return medicamentos.value.filter(m => 
    (m.nombre && m.nombre.toLowerCase().includes(query)) ||
    (m.usuario && m.usuario.toLowerCase().includes(query))
  )
})

onMounted(() => {
  cargarMedicamentos()
})
</script>