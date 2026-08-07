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
import { medicionesMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'tipo', label: 'Medición' },
  { key: 'valor', label: 'Valor' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'fecha', label: 'Fecha y hora' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Mediciones"
      subtitle="Registro de signos vitales capturados por los dispositivos"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Mediciones' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Registrar medición
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar por paciente..." />
        <FilterBar :filters="[{ label: 'Tipo de medición' }, { label: 'Paciente' }, { label: 'Rango de fecha' }]" />
      </div>

      <Table :columns="columns" :rows="medicionesMock">
        <template #cell-valor="{ value }">
          <span class="nums font-semibold text-ink-900">{{ value }}</span>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="5" :total-items="46" />
    </Card>

    <Modal v-model="showModal" title="Registrar medición" size="md">
      <div class="space-y-4">
        <Input label="Paciente" placeholder="Buscar paciente..." />
        <Input label="Tipo de medición" placeholder="Frecuencia cardíaca, presión, etc." />
        <Input label="Valor" placeholder="Ej. 78 bpm" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar medición</Button>
      </template>
    </Modal>
  </div>
</template>
