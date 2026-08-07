<script setup>
defineProps({
  items: { type: Array, required: true } // [{ label, to }]
})
</script>

<template>
  <nav class="flex items-center text-sm text-ink-400">
    <template v-for="(item, idx) in items" :key="idx">
      <RouterLink
        v-if="item.to && idx !== items.length - 1"
        :to="item.to"
        class="hover:text-primary-600 transition-colors"
      >
        {{ item.label }}
      </RouterLink>
      <span v-else class="font-medium text-ink-700">{{ item.label }}</span>
      <svg
        v-if="idx !== items.length - 1"
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5 mx-2 text-ink-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </template>
  </nav>
</template>
