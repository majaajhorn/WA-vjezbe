import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '../components/LoginRegister.vue'
import Tasks from '../components/Tasks.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginRegister
  },
  {
    path: '/tasks',
    component: Tasks,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})

export default router