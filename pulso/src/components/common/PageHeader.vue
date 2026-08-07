<script setup>
import Breadcrumb from '@/components/ui/Breadcrumb.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  breadcrumb: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
    <div>
      <Breadcrumb v-if="breadcrumb.length" :items="breadcrumb" class="mb-2" />
      <h1 class="text-2xl font-display font-bold text-ink-900 tracking-tight">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-ink-500 mt-1">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2 flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
