<template>
  <div class="space-y-6">
    <PageHeader
      title="Mediciones"
      subtitle="Registro de signos vitales capturados por los dispositivos"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Mediciones' }]"
    >
      <template #actions>
        <Button variant="primary" @click="abrirModal">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Registrar medición
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
        <SearchBar v-model="search" placeholder="Buscar por paciente..." />
        <FilterBar :filters="[{ label: 'Tipo de medición' }, { label: 'Paciente' }, { label: 'Rango de fecha' }]" />
      </div>

      <div v-if="cargando" class="text-center py-8 text-gray-500 text-sm">Cargando mediciones desde MongoDB Atlas...</div>
      
      <Table v-else :columns="columns" :rows="medicionesFiltradas">
        <template #cell-valor="{ row }">
          <span class="nums font-semibold text-ink-900">{{ row.valor }} {{ row.unidad }}</span>
        </template>
        <template #cell-usuario="{ row }">
          <span>{{ typeof row.usuario_id === 'object' ? (row.usuario_id.$oid || 'Paciente General') : (row.usuario_id || 'Paciente General') }}</span>
        </template>
        <template #cell-fecha="{ row }">
          <span>{{ formatearFecha(row.fecha) }}</span>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="1" :total-items="mediciones.length" />
    </Card>

    <Modal v-model="showModal" title="Registrar medición" size="md">
      <div class="space-y-4">
        <Input v-model="form.tipo" label="Tipo de medición" placeholder="Ej. Ritmo Cardíaco, Presión Arterial" />
        <Input v-model.number="form.valor" label="Valor numérico" type="number" placeholder="Ej. 80" />
        <Input v-model="form.unidad" label="Unidad de medida" placeholder="Ej. bpm, mmHg, °C" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" :disabled="cargandoGuardado" @click="guardarMedicion">
          {{ cargandoGuardado ? 'Guardando...' : 'Guardar medición' }}
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

const mediciones = ref([])

const form = ref({
  tipo: '',
  valor: '',
  unidad: ''
})

const columns = [
  { key: 'tipo', label: 'Medición' },
  { key: 'valor', label: 'Valor' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'fecha', label: 'Fecha y hora' }
]

const cargarMediciones = async () => {
  cargando.value = true
  try {
    const res = await api.get('/mediciones')
    mediciones.value = res.data
  } catch (err) {
    console.error('Error al cargar mediciones:', err)
  } finally {
    cargando.value = false
  }
}

const abrirModal = () => {
  form.value = { tipo: '', valor: '', unidad: '' }
  showModal.value = true
}

const guardarMedicion = async () => {
  if (!form.value.tipo || !form.value.valor || !form.value.unidad) {
    alert('Por favor completa todos los campos obligatorios.')
    return
  }

  cargandoGuardado.value = true
  mensajeEstado.value = ''
  esError.value = false

  try {
    const res = await api.post('/mediciones', form.value)
    mensajeEstado.value = res.data.mensaje || 'Medición registrada con éxito'
    showModal.value = false
    await cargarMediciones()
  } catch (err) {
    esError.value = true
    mensajeEstado.value = 'Error al registrar la medición en la base de datos'
  } finally {
    cargandoGuardado.value = false
  }
}

const medicionesFiltradas = computed(() => {
  if (!search.value) return mediciones.value
  const query = search.value.toLowerCase()
  return mediciones.value.filter(m => 
    (m.tipo && m.tipo.toLowerCase().includes(query)) ||
    (m.usuario_id && m.usuario_id.toLowerCase().includes(query))
  )
})

const formatearFecha = (f) => f ? new Date(f).toLocaleString() : ''

onMounted(() => {
  cargarMediciones()
})
</script>