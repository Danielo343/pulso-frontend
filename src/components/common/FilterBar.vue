<script setup>
defineProps({
  filters: { type: Array, default: () => [] } // [{ label }]
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="(filter, idx) in filters"
      :key="idx"
      type="button"
      class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-ink-200 bg-white text-xs font-medium text-ink-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors"
    >
      {{ filter.label }}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-ink-400 hover:text-ink-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Limpiar filtros
    </button>
  </div>
</template>
