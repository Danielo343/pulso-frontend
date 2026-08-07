<script setup>
defineProps({
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 }
})
defineEmits(['change'])
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
    <p class="text-xs text-ink-400">
      Mostrando <span class="font-medium text-ink-600">{{ (currentPage - 1) * 10 + 1 }}</span>
      –
      <span class="font-medium text-ink-600">{{ Math.min(currentPage * 10, totalItems) }}</span>
      de <span class="font-medium text-ink-600">{{ totalItems }}</span> registros
    </p>
    <div class="flex items-center gap-1">
      <button
        class="h-8 w-8 flex items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        :disabled="currentPage <= 1"
        @click="$emit('change', currentPage - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
        :class="page === currentPage ? 'bg-primary-600 text-white' : 'text-ink-500 hover:bg-ink-100'"
        @click="$emit('change', page)"
      >
        {{ page }}
      </button>
      <button
        class="h-8 w-8 flex items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        :disabled="currentPage >= totalPages"
        @click="$emit('change', currentPage + 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
