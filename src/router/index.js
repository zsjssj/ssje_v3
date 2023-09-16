import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/talk',
    name: 'talk',
    component: () => import('@/views/TalkView.vue')
  },
  {
    path: '/learn',
    name: 'learn',
    component: () => import('@/views/LearnView.vue')
  },
  {
    path: '/cesium',
    name: 'cesium',
    component: () => import('@/views/CesiumView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
