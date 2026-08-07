<script setup>
defineProps({
  label: { type: String, default: 'Cargando...' },
  fullscreen: { type: Boolean, default: false }
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3"
    :class="fullscreen ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm' : 'py-10'"
  >
    <div class="relative h-10 w-10">
      <span class="absolute inset-0 rounded-full bg-primary-500/40 animate-pulse-ring"></span>
      <span class="absolute inset-0 m-auto h-4 w-4 rounded-full bg-primary-600"></span>
    </div>
    <span v-if="label" class="text-sm font-medium text-ink-500">{{ label }}</span>
  </div>
</template>
