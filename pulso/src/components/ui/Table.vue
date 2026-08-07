<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label, align }]
  rows: { type: Array, default: () => [] },
  emptyMessage: { type: String, default: 'No hay registros disponibles.' }
})
</script>

<template>
  <div class="overflow-x-auto -mx-5 px-5">
    <table class="w-full text-sm border-collapse min-w-[640px]">
      <thead>
        <tr class="border-b border-ink-200">
          <th
            v-for="col in columns"
            :key="col.key"
            class="py-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-400 first:pl-0 last:pr-0"
            :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="row.id ?? idx"
          class="border-b border-ink-100 last:border-0 hover:bg-surface-muted transition-colors"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="py-3.5 px-3 text-ink-700 first:pl-0 last:pr-0"
            :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="py-12 text-center text-ink-400">
            <div class="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-ink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-6 4h6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm">{{ emptyMessage }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
