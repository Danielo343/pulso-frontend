<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="block">
    <span v-if="label" class="block text-sm font-medium text-ink-700 mb-1.5">{{ label }}</span>
    <div class="relative">
      <span v-if="$slots.icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
        <slot name="icon" />
      </span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-10 rounded-xl border bg-white text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:bg-ink-100 disabled:text-ink-400"
        :class="[
          $slots.icon ? 'pl-9 pr-3' : 'px-3',
          error ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-ink-200'
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <span v-if="error" class="block text-xs text-red-500 mt-1.5">{{ error }}</span>
    <span v-else-if="hint" class="block text-xs text-ink-400 mt-1.5">{{ hint }}</span>
  </label>
</template>
