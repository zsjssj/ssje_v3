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
    component: () => import('@/views/AboutView.vue'),
    children: [
      {
        path: '/about/three3d',
        name: 'three3d',
        component: () => import('@/views/ThreeView.vue')
      },
      {
        path: '/about/cesium',
        name: 'cesium',
        component: () => import('@/views/CesiumView.vue')
      },
      {
        path: '/about/echart',
        name: 'echart',
        component: () => import('@/views/EchartView.vue')
      },
      {
        path: '/about/amap',
        name: 'amap',
        component: () => import('@/views/GaodeView.vue')
      }
    ]
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
