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
import { recetasMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'folio', label: 'Folio' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'medico', label: 'Médico' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'estado', label: 'Estado', align: 'center' },
  { key: 'acciones', label: '', align: 'right' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Recetas Médicas"
      subtitle="Recetas emitidas para los pacientes registrados"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Recetas Médicas' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar receta
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar por folio o paciente..." />
        <FilterBar :filters="[{ label: 'Estado' }, { label: 'Médico' }]" />
      </div>

      <Table :columns="columns" :rows="recetasMock">
        <template #cell-folio="{ value }">
          <span class="nums font-semibold text-ink-900">{{ value }}</span>
        </template>
        <template #cell-estado="{ value }">
          <Badge :variant="value === 'Vigente' ? 'success' : 'danger'">{{ value }}</Badge>
        </template>
        <template #cell-acciones>
          <div class="flex justify-end">
            <button class="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="2" :total-items="15" />
    </Card>

    <Modal v-model="showModal" title="Agregar receta médica" size="md">
      <div class="space-y-4">
        <Input label="Paciente" placeholder="Buscar paciente..." />
        <Input label="Médico" placeholder="Nombre del médico" />
        <Input label="Indicaciones" placeholder="Descripción del tratamiento" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar receta</Button>
      </template>
    </Modal>
  </div>
</template>
