<script setup>
defineProps({
  name: { type: String, required: true }
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <!-- Dashboard -->
    <g v-if="name === 'dashboard'">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.5" />
      <rect x="13.5" y="10.5" width="7" height="10" rx="1.5" />
      <rect x="3.5" y="13" width="7" height="7.5" rx="1.5" />
    </g>
    <!-- Usuarios -->
    <g v-else-if="name === 'usuarios'">
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 20c0-3.6 2.46-6 5.5-6s5.5 2.4 5.5 6" />
      <circle cx="17.5" cy="8.5" r="2.25" />
      <path d="M15.75 14.25c2.55.15 4.75 2.35 4.75 5.75" />
    </g>
    <!-- Dispositivos -->
    <g v-else-if="name === 'dispositivos'">
      <rect x="7" y="2.5" width="10" height="19" rx="2.25" />
      <line x1="7" y1="6" x2="17" y2="6" />
      <line x1="7" y1="17.5" x2="17" y2="17.5" />
      <circle cx="12" cy="19.25" r="0.75" fill="currentColor" stroke="none" />
    </g>
    <!-- Mediciones (pulso) -->
    <g v-else-if="name === 'mediciones'">
      <path d="M2.5 12h4l2-5 3 10 2.5-7 1.5 2h6" />
    </g>
    <!-- Medicamentos -->
    <g v-else-if="name === 'medicamentos'">
      <rect x="3" y="8" width="8" height="8" rx="4" transform="rotate(-45 7 12)" />
      <line x1="4.5" y1="12" x2="9.5" y2="12" transform="rotate(-45 7 12)" />
      <path d="M13.5 14.5l5-5a3.2 3.2 0 00-4.5-4.5l-5 5" />
    </g>
    <!-- Historial Médico -->
    <g v-else-if="name === 'historial'">
      <path d="M6.5 2.75h8.75L19 6.5V20a1.25 1.25 0 01-1.25 1.25H6.5A1.25 1.25 0 015.25 20V4A1.25 1.25 0 016.5 2.75z" />
      <path d="M15 2.75V6.5h4" />
      <line x1="8.25" y1="11" x2="14.5" y2="11" />
      <line x1="8.25" y1="14.25" x2="14.5" y2="14.25" />
      <line x1="8.25" y1="17.5" x2="12" y2="17.5" />
    </g>
    <!-- Contactos de Emergencia -->
    <g v-else-if="name === 'contactos'">
      <path d="M4.5 4.75c0-.55.45-1 1-1h2.1c.47 0 .87.33.97.79l.72 3.24a1 1 0 01-.33.98l-1.5 1.25a12.2 12.2 0 006 6l1.25-1.5a1 1 0 01.98-.33l3.24.72c.46.1.79.5.79.97v2.1c0 .55-.45 1-1 1h-.75C10.15 19.72 4.28 13.85 4.5 5.5v-.75z" />
    </g>
    <!-- Eventos -->
    <g v-else-if="name === 'eventos'">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <line x1="3.5" y1="9.25" x2="20.5" y2="9.25" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
      <circle cx="8.25" cy="13.25" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.25" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.75" cy="13.25" r="1" fill="currentColor" stroke="none" />
    </g>
    <!-- Notificaciones -->
    <g v-else-if="name === 'notificaciones'">
      <path d="M6 9.5a6 6 0 0112 0c0 4 1.25 5.5 1.25 5.5H4.75S6 13.5 6 9.5z" />
      <path d="M10 18.5a2 2 0 004 0" />
    </g>
    <!-- Archivos Médicos -->
    <g v-else-if="name === 'archivos'">
      <path d="M3.5 6.75c0-1 .8-1.75 1.75-1.75h4l1.75 2h7.75c.97 0 1.75.78 1.75 1.75v9c0 .97-.78 1.75-1.75 1.75H5.25a1.75 1.75 0 01-1.75-1.75V6.75z" />
      <path d="M8.25 13.25a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0z" />
      <path d="M12.5 15.5c.35-1 1.15-1.65 2.25-1.65s1.9.65 2.25 1.65" />
    </g>
    <!-- Recetas Médicas -->
    <g v-else-if="name === 'recetas'">
      <path d="M6.5 2.75h11A1.25 1.25 0 0118.75 4v16.25L15.5 18l-3.25 2.25L9 18l-3.25 2.25V4A1.25 1.25 0 016.5 2.75z" />
      <line x1="8.5" y1="8" x2="15.5" y2="8" />
      <line x1="8.5" y1="11.25" x2="13" y2="11.25" />
      <path d="M9.5 15.25l1.25 1.25 2.25-2.5" />
    </g>
    <!-- Reportes -->
    <g v-else-if="name === 'reportes'">
      <path d="M4.5 20.5V9.5" />
      <path d="M10 20.5V5" />
      <path d="M15.5 20.5v-7" />
      <path d="M21 20.5V11" />
      <line x1="3" y1="20.5" x2="22" y2="20.5" />
    </g>
    <!-- Configuración -->
    <g v-else-if="name === 'configuracion'">
      <circle cx="12" cy="12" r="3.25" />
      <path d="M19.4 13.5a7.6 7.6 0 000-3l1.8-1.4-2-3.4-2.15.65a7.6 7.6 0 00-2.6-1.5L14 2.5h-4l-.45 2.35a7.6 7.6 0 00-2.6 1.5l-2.15-.65-2 3.4L4.6 10.5a7.6 7.6 0 000 3l-1.8 1.4 2 3.4 2.15-.65a7.6 7.6 0 002.6 1.5L10 21.5h4l.45-2.35a7.6 7.6 0 002.6-1.5l2.15.65 2-3.4-1.8-1.4z" />
    </g>
    <!-- Fallback -->
    <g v-else>
      <circle cx="12" cy="12" r="8" />
    </g>
  </svg>
</template>
