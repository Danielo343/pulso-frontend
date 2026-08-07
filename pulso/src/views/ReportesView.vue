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
import { reportesMock } from '@/services/mockData'

const search = ref('')

const columns = [
  { key: 'nombre', label: 'Reporte' },
  { key: 'usuario', label: 'Paciente' },
  { key: 'periodo', label: 'Periodo' },
  { key: 'formato', label: 'Formato', align: 'center' },
  { key: 'acciones', label: '', align: 'right' }
]

const summary = [
  { label: 'Reportes generados', value: '128', bg: 'bg-primary-50', color: 'text-primary-600' },
  { label: 'Este mes', value: '14', bg: 'bg-accent-50', color: 'text-accent-600' },
  { label: 'Programados', value: '5', bg: 'bg-amber-50', color: 'text-amber-600' }
]
</script>

<template>
  <div>
    <PageHeader
      title="Reportes"
      subtitle="Genera y consulta reportes de salud de tus pacientes"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Reportes' }]"
    >
      <template #actions>
        <Button variant="primary">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Generar reporte
        </Button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div v-for="s in summary" :key="s.label" class="bg-white rounded-2xl border border-ink-200/70 shadow-soft p-5 flex items-center gap-4">
        <div class="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0" :class="s.bg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="s.color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v-6.75m3.75 6.75V6.75m3.75 10.5v-3.75M4.5 20.25h15A1.5 1.5 0 0021 18.75V5.25a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v13.5a1.5 1.5 0 001.5 1.5z" />
          </svg>
        </div>
        <div>
          <p class="nums text-2xl font-bold text-ink-900">{{ s.value }}</p>
          <p class="text-xs text-ink-400">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar reporte..." />
        <FilterBar :filters="[{ label: 'Formato' }, { label: 'Periodo' }]" />
      </div>

      <Table :columns="columns" :rows="reportesMock">
        <template #cell-formato="{ value }">
          <Badge variant="info">{{ value }}</Badge>
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

      <Pagination :current-page="1" :total-pages="2" :total-items="16" />
    </Card>
  </div>
</template>
