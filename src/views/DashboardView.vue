<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/common/Badge.vue'
import Button from '@/components/ui/Button.vue'

const vitals = [
  { label: 'Frecuencia cardíaca', value: '78', unit: 'bpm', status: 'normal', bg: 'bg-red-50', color: 'text-red-500', trend: '+2 bpm vs. ayer' },
  { label: 'Presión arterial', value: '120/80', unit: 'mmHg', status: 'normal', bg: 'bg-violet-50', color: 'text-violet-500', trend: 'Estable esta semana' },
  { label: 'Oxígeno en sangre', value: '97', unit: '%SpO₂', status: 'normal', bg: 'bg-primary-50', color: 'text-primary-600', trend: 'Sin cambios' },
  { label: 'Temperatura', value: '36.5', unit: '°C', status: 'normal', bg: 'bg-amber-50', color: 'text-amber-500', trend: 'Rango normal' },
  { label: 'Pasos diarios', value: '3,240', unit: 'pasos', status: 'warning', bg: 'bg-accent-50', color: 'text-accent-600', trend: 'Meta: 5,000 pasos' },
  { label: 'Estado del dispositivo', value: '86', unit: '% batería', status: 'normal', bg: 'bg-primary-50', color: 'text-primary-600', trend: 'Pulsera Pulso M2' }
]

const medicamentos = [
  { nombre: 'Losartán 50mg', usuario: 'Rosa Martínez', hora: '08:00' },
  { nombre: 'Metformina 850mg', usuario: 'Jorge Delgado', hora: '09:00' },
  { nombre: 'Atorvastatina 20mg', usuario: 'Elena Vázquez', hora: '22:00' }
]

const eventos = [
  { titulo: 'Consulta de control', usuario: 'Rosa Martínez', fecha: '21 jul · 10:00' },
  { titulo: 'Estudio de laboratorio', usuario: 'Jorge Delgado', fecha: '22 jul · 09:00' },
  { titulo: 'Terapia física', usuario: 'Elena Vázquez', fecha: '23 jul · 16:30' }
]

const notificaciones = [
  { texto: 'Frecuencia cardíaca elevada detectada', usuario: 'Antonio Ruiz', tono: 'danger' },
  { texto: 'Medicamento tomado correctamente', usuario: 'Rosa Martínez', tono: 'success' },
  { texto: 'Dispositivo con batería baja', usuario: 'Antonio Ruiz', tono: 'warning' }
]

// Puntos de ejemplo para la gráfica de signos vitales (solo diseño)
const chartPoints = [40, 55, 48, 62, 58, 70, 65, 78, 72, 80, 76, 68]
const chartWidth = 640
const chartHeight = 160
const max = Math.max(...chartPoints)
const min = Math.min(...chartPoints)
const stepX = chartWidth / (chartPoints.length - 1)
const toY = (v) => chartHeight - ((v - min) / (max - min)) * (chartHeight - 20) - 10
const linePath = chartPoints.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${toY(v)}`).join(' ')
const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
</script>

<template>
  <div>
    <PageHeader title="Dashboard" subtitle="Resumen general del estado de salud de tus pacientes">
      <template #actions>
        <Button variant="outline" size="md">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h18M6 9h12M9 13.5h6M11 18h2" />
            </svg>
          </template>
          Filtros
        </Button>
        <Button variant="primary" size="md">
          <template #icon-left>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </template>
          Agregar usuario
        </Button>
      </template>
    </PageHeader>

    <!-- Tarjetas de signos vitales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <div
        v-for="vital in vitals"
        :key="vital.label"
        class="bg-white rounded-2xl border border-ink-200/70 shadow-soft p-5 hover:shadow-card transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="h-11 w-11 rounded-xl flex items-center justify-center" :class="vital.bg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="vital.color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="vital.label.includes('cardíaca')" stroke-linecap="round" stroke-linejoin="round" d="M2 12h4l1.5-4L12 18l2-9 1.5 3H22" />
              <path v-else-if="vital.label.includes('Presión')" stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z" />
              <path v-else-if="vital.label.includes('Oxígeno')" stroke-linecap="round" stroke-linejoin="round" d="M12 2.25s6 6.06 6 10.5a6 6 0 11-12 0c0-4.44 6-10.5 6-10.5z" />
              <path v-else-if="vital.label.includes('Temperatura')" stroke-linecap="round" stroke-linejoin="round" d="M10.5 4.5a1.5 1.5 0 013 0v8.19a4 4 0 11-3 0V4.5z" />
              <path v-else-if="vital.label.includes('Pasos')" stroke-linecap="round" stroke-linejoin="round" d="M6 3.5c1.5 0 2.25 1 2.25 2.25S7.5 8 6 8s-2.25-1-2.25-1.25S4.5 3.5 6 3.5zM15 10.5c1.5 0 2.25 1 2.25 2.25S16.5 15 15 15s-2.25-1-2.25-1.25.75-3.25 2.25-3.25zM4.5 10s.5 4 3 4 2-2.5 3.5-2.5M13.5 17s.5 4 3 4 2-2.5 3.5-2.5" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M9 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V15M9 3v6h6M9 3l6 6M15 3h6v6" />
            </svg>
          </div>
          <Badge :variant="vital.status === 'normal' ? 'success' : 'warning'">
            {{ vital.status === 'normal' ? 'Normal' : 'Atención' }}
          </Badge>
        </div>
        <p class="text-xs font-medium text-ink-400 mb-1">{{ vital.label }}</p>
        <div class="flex items-baseline gap-1.5">
          <span class="nums text-3xl font-bold text-ink-900">{{ vital.value }}</span>
          <span class="text-sm font-medium text-ink-400">{{ vital.unit }}</span>
        </div>
        <p class="text-xs text-ink-400 mt-1.5">{{ vital.trend }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Gráfica de signos vitales -->
      <Card class="xl:col-span-2">
        <template #header>
          <div>
            <h3 class="font-semibold text-ink-900">Signos vitales</h3>
            <p class="text-xs text-ink-400 mt-0.5">Frecuencia cardíaca — últimas 12 horas</p>
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <span class="h-2 w-2 rounded-full bg-primary-500"></span>
            <span class="text-ink-500">Promedio del día</span>
          </div>
        </template>

        <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="w-full h-44" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.18" />
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="areaPath" fill="url(#chartFill)" />
          <path :d="linePath" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle
            v-for="(v, i) in chartPoints"
            :key="i"
            :cx="i * stepX"
            :cy="toY(v)"
            r="3"
            fill="white"
            stroke="#2563EB"
            stroke-width="2"
          />
        </svg>
        <div class="flex justify-between text-[11px] text-ink-400 mt-2 px-1">
          <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span>
        </div>
      </Card>

      <!-- Próximos medicamentos -->
      <Card>
        <template #header>
          <h3 class="font-semibold text-ink-900">Próximos medicamentos</h3>
          <RouterLink to="/medicamentos" class="text-xs font-medium text-primary-600 hover:text-primary-700">Ver todo</RouterLink>
        </template>
        <ul class="space-y-3">
          <li v-for="(m, i) in medicamentos" :key="i" class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="8" width="8" height="8" rx="4" transform="rotate(-45 7 12)" />
                <path d="M13.5 14.5l5-5a3.2 3.2 0 00-4.5-4.5l-5 5" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-ink-800 truncate">{{ m.nombre }}</p>
              <p class="text-xs text-ink-400 truncate">{{ m.usuario }}</p>
            </div>
            <span class="nums text-xs font-semibold text-ink-500 flex-shrink-0">{{ m.hora }}</span>
          </li>
        </ul>
      </Card>

      <!-- Próximos eventos -->
      <Card>
        <template #header>
          <h3 class="font-semibold text-ink-900">Próximos eventos</h3>
          <RouterLink to="/eventos" class="text-xs font-medium text-primary-600 hover:text-primary-700">Ver todo</RouterLink>
        </template>
        <ul class="space-y-3">
          <li v-for="(e, i) in eventos" :key="i" class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-lg bg-accent-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
                <line x1="3.5" y1="9.25" x2="20.5" y2="9.25" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-ink-800 truncate">{{ e.titulo }}</p>
              <p class="text-xs text-ink-400 truncate">{{ e.usuario }}</p>
            </div>
            <span class="nums text-xs font-semibold text-ink-500 flex-shrink-0">{{ e.fecha }}</span>
          </li>
        </ul>
      </Card>

      <!-- Últimas notificaciones -->
      <Card>
        <template #header>
          <h3 class="font-semibold text-ink-900">Últimas notificaciones</h3>
          <RouterLink to="/notificaciones" class="text-xs font-medium text-primary-600 hover:text-primary-700">Ver todo</RouterLink>
        </template>
        <ul class="space-y-3">
          <li v-for="(n, i) in notificaciones" :key="i" class="flex items-start gap-2.5">
            <span
              class="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
              :class="{
                'bg-red-500': n.tono === 'danger',
                'bg-accent-500': n.tono === 'success',
                'bg-amber-500': n.tono === 'warning'
              }"
            />
            <div class="min-w-0">
              <p class="text-sm text-ink-700 leading-snug">{{ n.texto }}</p>
              <p class="text-xs text-ink-400 mt-0.5">{{ n.usuario }}</p>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>
