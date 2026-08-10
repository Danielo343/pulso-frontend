<script setup>
defineProps({
  padded: { type: Boolean, default: true },
  hoverable: { type: Boolean, default: false }
})
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-ink-200/70 shadow-soft"
    :class="[padded ? 'p-5' : '', hoverable ? 'transition-shadow hover:shadow-card' : '']"
  >
    <div v-if="$slots.header" class="flex items-center justify-between mb-4">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-ink-200/70">
      <slot name="footer" />
    </div>
  </div>
</template>
