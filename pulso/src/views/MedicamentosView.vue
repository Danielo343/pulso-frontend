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
import { medicamentosMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'nombre', label: 'Medicamento' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'dosis', label: 'Dosis' },
  { key: 'horario', label: 'Horario' },
  { key: 'estado', label: 'Estado', align: 'center' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Medicamentos"
      subtitle="Tratamientos activos y horarios de administración"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Medicamentos' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar medicamento
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar medicamento..." />
        <FilterBar :filters="[{ label: 'Paciente' }, { label: 'Estado' }]" />
      </div>

      <Table :columns="columns" :rows="medicamentosMock">
        <template #cell-estado="{ value }">
          <Badge :variant="value === 'Activo' ? 'success' : 'neutral'">{{ value }}</Badge>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="2" :total-items="18" />
    </Card>

    <Modal v-model="showModal" title="Agregar medicamento" size="md">
      <div class="space-y-4">
        <Input label="Nombre del medicamento" placeholder="Ej. Losartán 50mg" />
        <Input label="Paciente" placeholder="Buscar paciente..." />
        <div class="grid grid-cols-2 gap-4">
          <Input label="Dosis" placeholder="1 tableta" />
          <Input label="Horario" placeholder="08:00 / 20:00" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar</Button>
      </template>
    </Modal>
  </div>
</template>
