<template>
  <transition name="bounce">
    <div
      v-if="uiStore.toast.visible"
      :class="`fixed top-5 right-5 z-50 max-w-sm w-full p-4 rounded-xl shadow-xl border flex items-center justify-between space-x-3 ${
        uiStore.toast.tipo === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        uiStore.toast.tipo === 'alerta' ? 'bg-amber-50 border-amber-200 text-amber-800' :
        'bg-green-50 border-green-200 text-green-800'
      }`"
    >
      <div class="flex items-center space-x-3">
        <span class="text-xl">
          {{ uiStore.toast.tipo === 'error' ? '🚨' : uiStore.toast.tipo === 'alerta' ? '⚠️' : '✅' }}
        </span>
        <p class="text-xs font-semibold">{{ uiStore.toast.mensaje }}</p>
      </div>

      <button @click="uiStore.ocultarToast" class="text-gray-400 hover:text-gray-600 font-bold text-sm">&times;</button>
    </div>
  </transition>
</template>

<script setup>
import { useUiStore } from '../../stores/ui'
const uiStore = useUiStore()
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>