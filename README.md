# Pulso — Frontend

Esqueleto de frontend para **Pulso**, una aplicación de monitoreo de salud para adultos mayores.

Este proyecto contiene **únicamente la interfaz y la navegación**. No incluye conexión a backend, API, base de datos ni lógica de negocio. Todos los datos que se muestran son de ejemplo y sirven para maquetar el diseño.

## Tecnologías

- Vue 3 (`<script setup>`)
- Vite
- Vue Router 4
- Pinia
- Tailwind CSS
- Axios (instancia preparada, sin peticiones activas)

## Estructura del proyecto

```
src/
├── assets/              # Estilos globales
├── components/
│   ├── layout/           # Navbar, Sidebar, Footer
│   ├── ui/                # Componentes base reutilizables (Button, Card, Modal, Table...)
│   └── common/            # Composición de página (PageHeader, SearchBar, Pagination...)
├── layouts/              # AppLayout (con sidebar) y AuthLayout (login)
├── router/               # Definición de rutas
├── stores/               # Pinia: ui.js (sidebar) y auth.js (usuario de ejemplo)
├── services/             # api.js (instancia Axios) y mockData.js (datos de ejemplo)
├── views/                # Las 14 vistas del sistema
├── App.vue
└── main.js
```

## Puesta en marcha

```bash
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

Para generar la build de producción:

```bash
npm run build
npm run preview
```

## Conexión futura con el backend (Laravel)

- `src/services/api.js` ya contiene una instancia de Axios configurada con `VITE_API_BASE_URL` (ver `.env.example`) e interceptores listos para adjuntar el token de autenticación.
- `src/services/mockData.js` centraliza los datos de ejemplo usados en las vistas; al conectar la API, estos arreglos deben sustituirse por llamadas a los endpoints correspondientes (por ejemplo, dentro de un `onMounted` o mediante Pinia con acciones asíncronas).
- Los stores de Pinia (`stores/auth.js`) están preparados con métodos vacíos (`login`, `logout`) listos para integrarse con la autenticación real.

## Módulos incluidos

Dashboard · Usuarios · Dispositivos · Mediciones · Medicamentos · Historial Médico · Contactos de Emergencia · Eventos · Notificaciones · Archivos Médicos · Recetas Médicas · Reportes · Configuración

## Diseño

Paleta de colores basada en azul (`#2563EB`) y verde (`#22C55E`) sobre fondos blancos y grises claros, inspirada en Apple Health, Samsung Health y Material Design. Totalmente responsive (escritorio, tablet y celular).
