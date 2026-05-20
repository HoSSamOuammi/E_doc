import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import AdminFormationsView from '../views/AdminFormationsView.vue'
import StudentFormationsView from '../views/StudentFormationsView.vue'
import MyFormationView from '../views/MyFormationView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/admin/formations', component: AdminFormationsView },
  { path: '/student/formations', component: StudentFormationsView },
  { path: '/student/my-formation', component: MyFormationView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router