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
import { contactosMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'nombre', label: 'Contacto' },
  { key: 'relacion', label: 'Relación' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'prioridad', label: 'Prioridad', align: 'center' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Contactos de Emergencia"
      subtitle="Personas a notificar ante una alerta médica"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Contactos de Emergencia' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar contacto
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar contacto..." />
        <FilterBar :filters="[{ label: 'Prioridad' }, { label: 'Relación' }]" />
      </div>

      <Table :columns="columns" :rows="contactosMock">
        <template #cell-prioridad="{ value }">
          <Badge :variant="value === 'Principal' ? 'info' : 'neutral'">{{ value }}</Badge>
        </template>
        <template #cell-telefono="{ value }">
          <span class="nums">{{ value }}</span>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="1" :total-items="4" />
    </Card>

    <Modal v-model="showModal" title="Agregar contacto de emergencia" size="md">
      <div class="space-y-4">
        <Input label="Nombre completo" placeholder="Ej. María Martínez" />
        <Input label="Relación" placeholder="Hija, médico tratante..." />
        <Input label="Teléfono" type="tel" placeholder="+52 33 1234 5678" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Guardar contacto</Button>
      </template>
    </Modal>
  </div>
</template>
