import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { title: 'Iniciar sesión' }
      }
    ]
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/UsuariosView.vue'),
        meta: { title: 'Usuarios' }
      },
      {
        path: 'dispositivos',
        name: 'dispositivos',
        component: () => import('@/views/DispositivosView.vue'),
        meta: { title: 'Dispositivos' }
      },
      {
        path: 'mediciones',
        name: 'mediciones',
        component: () => import('@/views/MedicionesView.vue'),
        meta: { title: 'Mediciones' }
      },
      {
        path: 'medicamentos',
        name: 'medicamentos',
        component: () => import('@/views/MedicamentosView.vue'),
        meta: { title: 'Medicamentos' }
      },
      {
        path: 'historial-medico',
        name: 'historial-medico',
        component: () => import('@/views/HistorialMedicoView.vue'),
        meta: { title: 'Historial Médico' }
      },
      {
        path: 'contactos',
        name: 'contactos',
        component: () => import('@/views/ContactosView.vue'),
        meta: { title: 'Contactos de Emergencia' }
      },
      {
        path: 'eventos',
        name: 'eventos',
        component: () => import('@/views/EventosView.vue'),
        meta: { title: 'Eventos' }
      },
      {
        path: 'notificaciones',
        name: 'notificaciones',
        component: () => import('@/views/NotificacionesView.vue'),
        meta: { title: 'Notificaciones' }
      },
      {
        path: 'archivos-medicos',
        name: 'archivos-medicos',
        component: () => import('@/views/ArchivosMedicosView.vue'),
        meta: { title: 'Archivos Médicos' }
      },
      {
        path: 'recetas',
        name: 'recetas',
        component: () => import('@/views/RecetasView.vue'),
        meta: { title: 'Recetas Médicas' }
      },
      {
        path: 'reportes',
        name: 'reportes',
        component: () => import('@/views/ReportesView.vue'),
        meta: { title: 'Reportes' }
      },
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('@/views/ConfiguracionView.vue'),
        meta: { title: 'Configuración' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · Pulso` : 'Pulso'
})

export default router
