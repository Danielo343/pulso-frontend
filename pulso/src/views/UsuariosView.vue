<script setup>
import { ref } from 'vue'
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
import { usuariosMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'nombre', label: 'Paciente' },
  { key: 'edad', label: 'Edad', align: 'center' },
  { key: 'parentesco', label: 'Parentesco' },
  { key: 'dispositivo', label: 'Dispositivo' },
  { key: 'estado', label: 'Estado', align: 'center' },
  { key: 'acciones', label: '', align: 'right' }
]

const badgeVariant = (estado) => {
  if (estado === 'Estable') return 'success'
  if (estado === 'En observación') return 'warning'
  return 'danger'
}
</script>

<template>
  <div>
    <PageHeader
      title="Usuarios"
      subtitle="Adultos mayores registrados y monitoreados en Pulso"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Usuarios' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar usuario
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar por nombre de paciente..." />
        <FilterBar :filters="[{ label: 'Estado' }, { label: 'Parentesco' }, { label: 'Dispositivo' }]" />
      </div>

      <Table :columns="columns" :rows="usuariosMock">
        <template #cell-nombre="{ row }">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {{ row.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('') }}
            </div>
            <span class="font-medium text-ink-800">{{ row.nombre }}</span>
          </div>
        </template>
        <template #cell-estado="{ value }">
          <Badge :variant="badgeVariant(value)">{{ value }}</Badge>
        </template>
        <template #cell-acciones="{ row }">
          <div class="flex justify-end gap-1">
            <button class="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397M4.772 5.79c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="3" :total-items="24" />
    </Card>

    <Modal v-model="showModal" title="Agregar usuario" size="md">
      <div class="space-y-4">
        <Input label="Nombre completo" placeholder="Ej. Rosa Martínez" />
        <div class="grid grid-cols-2 gap-4">
          <Input label="Edad" type="number" placeholder="78" />
          <Input label="Parentesco" placeholder="Madre" />
        </div>
        <Input label="Dispositivo asignado" placeholder="Pulsera Pulso M2" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar usuario</Button>
      </template>
    </Modal>
  </div>
</template>
