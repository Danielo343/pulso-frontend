<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import { historialMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'usuario', label: 'Paciente' },
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'medico', label: 'Médico tratante' },
  { key: 'fecha', label: 'Fecha' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Historial Médico"
      subtitle="Antecedentes y diagnósticos registrados por paciente"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Historial Médico' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar registro
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar por paciente o diagnóstico..." />
        <FilterBar :filters="[{ label: 'Médico' }, { label: 'Rango de fecha' }]" />
      </div>

      <Table :columns="columns" :rows="historialMock" />

      <Pagination :current-page="1" :total-pages="3" :total-items="21" />
    </Card>

    <Modal v-model="showModal" title="Agregar registro médico" size="md">
      <div class="space-y-4">
        <Input label="Paciente" placeholder="Buscar paciente..." />
        <Input label="Diagnóstico" placeholder="Ej. Hipertensión controlada" />
        <Input label="Médico tratante" placeholder="Nombre del médico" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar</Button>
      </template>
    </Modal>
  </div>
</template>
