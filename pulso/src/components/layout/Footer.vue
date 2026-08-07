<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-4 sm:px-6 py-5 mt-auto">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-400 border-t border-ink-200/70 pt-5">
      <p>© {{ year }} Pulso · Monitoreo de salud para adultos mayores</p>
      <div class="flex items-center gap-4">
        <a href="#" class="hover:text-primary-600 transition-colors">Privacidad</a>
        <a href="#" class="hover:text-primary-600 transition-colors">Términos</a>
        <a href="#" class="hover:text-primary-600 transition-colors">Soporte</a>
      </div>
    </div>
  </footer>
</template>
