import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layouts
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Vistas
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ContactosView from '../views/ContactosView.vue'
import DispositivosView from '../views/DispositivosView.vue'
import EventosView from '../views/EventosView.vue'
import MedicionesView from '../views/MedicionesView.vue'
import MedicamentosView from '../views/MedicamentosView.vue'
import RecetasView from '../views/RecetasView.vue'
import ArchivosMedicosView from '../views/ArchivosMedicosView.vue'
import HistorialMedicoView from '../views/HistorialMedicoView.vue'
import NotificacionesView from '../views/NotificacionesView.vue'
import ReportesView from '../views/ReportesView.vue'
import ConfiguracionView from '../views/ConfiguracionView.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiereAuth: false }
      }
    ]
  },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    meta: { requiereAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardView },
      { path: 'usuarios', name: 'usuarios', component: UsuariosView },
      { path: 'contactos', name: 'contactos', component: ContactosView },
      { path: 'dispositivos', name: 'dispositivos', component: DispositivosView },
      { path: 'eventos', name: 'eventos', component: EventosView },
      { path: 'mediciones', name: 'mediciones', component: MedicionesView },
      { path: 'medicamentos', name: 'medicamentos', component: MedicamentosView },
      { path: 'recetas', name: 'recetas', component: RecetasView },
      { path: 'archivos-medicos', name: 'archivos-medicos', component: ArchivosMedicosView },
      { path: 'historial-medico', name: 'historial-medico', component: HistorialMedicoView },
      { path: 'notificaciones', name: 'notificaciones', component: NotificacionesView },
      { path: 'reportes', name: 'reportes', component: ReportesView },
      { path: 'configuracion', name: 'configuracion', component: ConfiguracionView }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardián de Navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const estaProtegida = to.matched.some(record => record.meta.requiereAuth)

  if (estaProtegida && !authStore.estaAutenticado) {
    next('/login')
  } else if (to.path === '/login' && authStore.estaAutenticado) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router