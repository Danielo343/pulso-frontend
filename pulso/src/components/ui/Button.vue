<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary | secondary | ghost | danger | outline
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger', 'outline'].includes(v)
  },
  size: {
    type: String,
    default: 'md', // sm | md | lg
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  icon: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' }
})

defineEmits(['click'])

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary-600/20 focus-visible:ring-primary-500',
  secondary: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm shadow-accent-500/20 focus-visible:ring-accent-500',
  outline: 'bg-white text-ink-700 border border-ink-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-500',
  ghost: 'bg-transparent text-ink-500 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-ink-300',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400'
}

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl'
}

const iconSizes = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
  lg: 'h-12 w-12 rounded-xl'
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      base,
      variants[variant],
      icon ? iconSizes[size] : sizes[size],
      block ? 'w-full' : ''
    ]"
    @click="$emit('click', $event)"
  >
    <slot name="icon-left" />
    <slot v-if="!icon" />
    <slot v-else name="icon" />
    <slot name="icon-right" />
  </button>
</template>
