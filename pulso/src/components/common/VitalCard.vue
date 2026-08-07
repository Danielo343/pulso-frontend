<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  status: { type: String, default: 'normal' }, // normal | warning | alert
  colorClass: { type: String, default: 'text-primary-600' },
  bgClass: { type: String, default: 'bg-primary-50' },
  trend: { type: String, default: '' }
})

const statusLabel = {
  normal: 'Normal',
  warning: 'Atención',
  alert: 'Alerta'
}

const statusColor = {
  normal: 'text-accent-600 bg-accent-50',
  warning: 'text-amber-600 bg-amber-50',
  alert: 'text-red-600 bg-red-50'
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-ink-200/70 shadow-soft p-5 flex flex-col gap-4 hover:shadow-card transition-shadow">
    <div class="flex items-start justify-between">
      <div class="h-11 w-11 rounded-xl flex items-center justify-center" :class="bgClass">
        <slot name="icon" />
      </div>
      <span class="text-[11px] font-semibold px-2 py-1 rounded-full" :class="statusColor[status]">
        {{ statusLabel[status] }}
      </span>
    </div>
    <div>
      <p class="text-xs font-medium text-ink-400 mb-1">{{ label }}</p>
      <div class="flex items-baseline gap-1">
        <span class="nums text-3xl font-bold text-ink-900">{{ value }}</span>
        <span class="text-sm font-medium text-ink-400">{{ unit }}</span>
      </div>
      <p v-if="trend" class="text-xs text-ink-400 mt-1">{{ trend }}</p>
    </div>
  </div>
</template>
