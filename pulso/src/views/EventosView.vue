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
import { eventosMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'titulo', label: 'Evento' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'tipo', label: 'Tipo', align: 'center' },
  { key: 'fecha', label: 'Fecha y hora' }
]

const badgeVariant = (tipo) => {
  if (tipo === 'Cita médica') return 'info'
  if (tipo === 'Laboratorio') return 'warning'
  return 'success'
}
</script>

<template>
  <div>
    <PageHeader
      title="Eventos"
      subtitle="Citas médicas, terapias y estudios programados"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Eventos' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar evento
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar evento..." />
        <FilterBar :filters="[{ label: 'Tipo' }, { label: 'Paciente' }, { label: 'Rango de fecha' }]" />
      </div>

      <Table :columns="columns" :rows="eventosMock">
        <template #cell-tipo="{ value }">
          <Badge :variant="badgeVariant(value)">{{ value }}</Badge>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="2" :total-items="12" />
    </Card>

    <Modal v-model="showModal" title="Agregar evento" size="md">
      <div class="space-y-4">
        <Input label="Título del evento" placeholder="Ej. Consulta de control" />
        <Input label="Paciente" placeholder="Buscar paciente..." />
        <div class="grid grid-cols-2 gap-4">
          <Input label="Tipo" placeholder="Cita médica, terapia..." />
          <Input label="Fecha y hora" type="datetime-local" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar evento</Button>
      </template>
    </Modal>
  </div>
</template>
