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
import { archivosMock } from '@/services/mockData'

const search = ref('')
const showModal = ref(false)

const columns = [
  { key: 'nombre', label: 'Archivo' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'tipo', label: 'Tipo', align: 'center' },
  { key: 'tamano', label: 'Tamaño', align: 'center' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'acciones', label: '', align: 'right' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Archivos Médicos"
      subtitle="Estudios, imágenes y documentos clínicos"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Archivos Médicos' }]"
    >
      <template #actions>
        <Button variant="primary" @click="showModal = true">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </template>
          Subir archivo
        </Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar archivo..." />
        <FilterBar :filters="[{ label: 'Tipo' }, { label: 'Paciente' }]" />
      </div>

      <Table :columns="columns" :rows="archivosMock">
        <template #cell-nombre="{ row }">
          <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span class="font-medium text-ink-800 truncate">{{ row.nombre }}</span>
          </div>
        </template>
        <template #cell-tipo="{ value }">
          <Badge variant="neutral">{{ value }}</Badge>
        </template>
        <template #cell-acciones>
          <div class="flex justify-end">
            <button class="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3" />
              </svg>
            </button>
          </div>
        </template>
      </Table>

      <Pagination :current-page="1" :total-pages="3" :total-items="27" />
    </Card>

    <Modal v-model="showModal" title="Subir archivo médico" size="md">
      <div class="space-y-4">
        <Input label="Paciente" placeholder="Buscar paciente..." />
        <Input label="Nombre del archivo" placeholder="Ej. Estudio_sangre_junio.pdf" />
        <label class="block">
          <span class="block text-sm font-medium text-ink-700 mb-1.5">Archivo</span>
          <div class="border-2 border-dashed border-ink-200 rounded-xl py-8 flex flex-col items-center justify-center text-ink-400 hover:border-primary-300 hover:text-primary-500 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span class="text-xs">Arrastra un archivo o haz clic para seleccionar</span>
          </div>
        </label>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">Cancelar</Button>
        <Button variant="primary" @click="showModal = false">Subir archivo</Button>
      </template>
    </Modal>
  </div>
</template>
