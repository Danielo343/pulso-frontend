<script setup></script>

<template>
  <div class="min-h-screen flex bg-surface-muted">
    <!-- Panel de marca -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-600">
      <div class="absolute inset-0 opacity-20">
        <svg class="h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="none">
          <path d="M0 200h60l20-60 40 120 30-90 20 30h230" stroke="white" stroke-width="2" fill="none" opacity="0.5" />
          <path d="M0 260h100l15-40 35 90 25-70 15 20h210" stroke="white" stroke-width="2" fill="none" opacity="0.3" />
        </svg>
      </div>
      <div class="relative z-10 flex flex-col justify-between p-12 text-white">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 flex items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h4l1.5-4L12 18l2-9 1.5 3H22" />
            </svg>
          </div>
          <span class="font-display font-extrabold text-2xl">Pulso</span>
        </div>

        <div class="max-w-md">
          <h2 class="font-display text-3xl font-bold leading-tight mb-4">
            Cuidado conectado para quienes más importan.
          </h2>
          <p class="text-primary-100 text-sm leading-relaxed">
            Supervisa signos vitales, medicamentos y eventos médicos de tus adultos mayores
            en un solo lugar, con información clara y al momento.
          </p>
        </div>

        <div class="flex items-center gap-6 text-sm text-primary-100">
          <div>
            <p class="text-2xl font-display font-bold text-white">24/7</p>
            <p>Monitoreo activo</p>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div>
            <p class="text-2xl font-display font-bold text-white">+12</p>
            <p>Indicadores de salud</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de formulario -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-sm">
        <RouterView />
      </div>
    </div>
  </div>
</template>
