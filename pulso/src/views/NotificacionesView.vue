<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { notificacionesMock } from '@/services/mockData'

const search = ref('')

const toneStyles = {
  alerta: { dot: 'bg-red-500', bg: 'bg-red-50', icon: 'text-red-500' },
  advertencia: { dot: 'bg-amber-500', bg: 'bg-amber-50', icon: 'text-amber-500' },
  info: { dot: 'bg-primary-500', bg: 'bg-primary-50', icon: 'text-primary-600' }
}
</script>

<template>
  <div>
    <PageHeader
      title="Notificaciones"
      subtitle="Alertas e información relevante sobre tus pacientes"
      :breadcrumb="[{ label: 'Dashboard', to: '/' }, { label: 'Notificaciones' }]"
    >
      <template #actions>
        <Button variant="outline">Marcar todas como leídas</Button>
      </template>
    </PageHeader>

    <Card>
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <SearchBar v-model="search" placeholder="Buscar notificación..." />
        <FilterBar :filters="[{ label: 'Tipo' }, { label: 'Paciente' }]" />
      </div>

      <ul class="divide-y divide-ink-100">
        <li
          v-for="n in notificacionesMock"
          :key="n.id"
          class="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0 hover:bg-surface-muted -mx-2 px-2 rounded-xl transition-colors"
        >
          <div class="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="toneStyles[n.tipo].bg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="toneStyles[n.tipo].icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-ink-800">{{ n.mensaje }}</p>
            <p class="text-xs text-ink-400 mt-0.5">{{ n.usuario }} · {{ n.fecha }}</p>
          </div>
          <span class="h-2 w-2 rounded-full mt-2 flex-shrink-0" :class="toneStyles[n.tipo].dot"></span>
        </li>
      </ul>

      <Pagination :current-page="1" :total-pages="4" :total-items="32" />
    </Card>
  </div>
</template>
