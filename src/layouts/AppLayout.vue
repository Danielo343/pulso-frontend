<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Menú Lateral Izquierdo -->
    <Sidebar />

    <!-- Contenedor Principal -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <!-- Barra Superior Fija -->
      <Navbar />

      <!-- Vistas con Padding Superior de 80px (pt-20) para no solaparse con el Navbar -->
      <main class="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Pie de Página -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/layout/Navbar.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import Footer from '../components/layout/Footer.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>