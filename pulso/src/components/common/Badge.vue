<script setup>
defineProps({
  variant: {
    type: String,
    default: 'neutral', // neutral | success | warning | danger | info
    validator: (v) => ['neutral', 'success', 'warning', 'danger', 'info'].includes(v)
  }
})

const styles = {
  neutral: 'bg-ink-100 text-ink-600',
  success: 'bg-accent-100 text-accent-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-primary-100 text-primary-700'
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" :class="styles[variant]">
    <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
    <slot />
  </span>
</template>
