import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'

import AdminFormationsView from '../views/admin/AdminFormationsView.vue'
import AdminStudentsView from '../views/admin/AdminStudentsView.vue'
import AdminInscriptionsView from '../views/admin/AdminInscriptionsView.vue'

import StudentFormationsView from '../views/student/StudentFormationsView.vue'
import MyFormationView from '../views/student/MyFormationView.vue'
import { getCurrentUser } from '../services/api'

const routes = [
  { path: '/', component: LoginView },

  { path: '/admin/formations', component: AdminFormationsView, meta: { role: 'admin' } },
  { path: '/admin/students', component: AdminStudentsView, meta: { role: 'admin' } },
  { path: '/admin/inscriptions', component: AdminInscriptionsView, meta: { role: 'admin' } },

  { path: '/student/formations', component: StudentFormationsView, meta: { role: 'etudiant' } },
  { path: '/student/my-formation', component: MyFormationView, meta: { role: 'etudiant' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (!to.meta.role) {
    return true
  }

  const currentUser = getCurrentUser()

  if (!currentUser || currentUser.role !== to.meta.role) {
    return '/'
  }

  return true
})

export default router
