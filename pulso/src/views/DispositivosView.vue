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
import { dispositivosMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'nombre', label: 'Dispositivo' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'usuario', label: 'Asignado a' },
  { key: 'bateria', label: 'Batería', align: 'center' },
  { key: 'estado', label: 'Estado', align: 'center' }
]

const badgeVariant = (estado) => {
  if (estado === 'Conectado') return 'success'
  if (estado === 'Batería baja') return 'warning'
  return 'neutral'
}
</script>

<template>
  <div>
    <PageHeader
      title="Dispositivos"
      subtitle="Wearables y equipos médicos vinculados a Pulso"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Dispositivos' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Vincular dispositivo
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar dispositivo..." />
        <FilterBar :filters="[{ label: 'Tipo' }, { label: 'Estado' }]" />
      </div>

      <Table :columns="columns" :rows="dispositivosMock">
        <template #cell-estado="{ value }">
          <Badge :variant="badgeVariant(value)">{{ value }}</Badge>
        </template>
        <template #cell-bateria="{ value }">
          <span class="nums font-medium">{{ value }}</span>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="2" :total-items="14" />
    </Card>

    <Modal v-model="showModal" title="Vincular dispositivo" size="md">
      <div class="space-y-4">
        <Input label="Nombre del dispositivo" placeholder="Ej. Pulsera Pulso M2" />
        <Input label="Tipo" placeholder="Wearable, monitor, báscula..." />
        <Input label="Asignar a usuario" placeholder="Buscar paciente..." />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Vincular</Button>
      </template>
    </Modal>
  </div>
</template>
