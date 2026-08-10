<script setup>
defineProps({
  variant: {
    type: String,
    default: 'info', // info | success | warning | danger
    validator: (v) => ['info', 'success', 'warning', 'danger'].includes(v)
  },
  title: { type: String, default: '' }
})

const styles = {
  info: { wrap: 'bg-primary-50 border-primary-200 text-primary-800', icon: 'text-primary-600' },
  success: { wrap: 'bg-accent-50 border-accent-200 text-accent-700', icon: 'text-accent-600' },
  warning: { wrap: 'bg-amber-50 border-amber-200 text-amber-800', icon: 'text-amber-600' },
  danger: { wrap: 'bg-red-50 border-red-200 text-red-700', icon: 'text-red-600' }
}
</script>

<template>
  <div class="flex gap-3 rounded-xl border p-4" :class="styles[variant].wrap">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mt-0.5" :class="styles[variant].icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path v-if="variant === 'success'" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path v-else-if="variant === 'danger'" stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-3.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      <path v-else-if="variant === 'warning'" stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
    <div class="text-sm">
      <p v-if="title" class="font-semibold mb-0.5">{{ title }}</p>
      <div><slot /></div>
    </div>
  </div>
</template>
