import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
    meta: { title: '首页' }
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: '首页' },
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    meta: { title: '关于' },
    redirect: '/about/three3d',
    component: () => import('@/views/AboutView.vue'),
    children: [
      {
        path: '/about/three3d',
        name: 'three3d',
        meta: { title: '模型3d' },
        component: () => import('@/views/ThreeView.vue')
      },
      {
        path: '/about/cesium',
        name: 'cesium',
        meta: { title: '地理3D' },
        component: () => import('@/views/CesiumView.vue')
      },
      {
        path: '/about/echart',
        name: 'echart',
        meta: { title: '图表地图' },
        component: () => import('@/views/EchartView.vue')
      },
      {
        path: '/about/amap',
        name: 'amap',
        meta: { title: '高德地图' },
        component: () => import('@/views/GaodeView.vue')
      }
    ]
  },
  // {
  //   path: '/talk',
  //   name: 'talk',
  //   meta: { title: '' },
  //   component: () => import('@/views/TalkView.vue')
  // },
  {
    path: '/learn',
    name: 'learn',
    meta: { title: '知识点' },
    component: () => import('@/views/LearnView.vue')
  },
  {
    path: '/canvas',
    name: 'canvas',
    meta: { title: '技术尝试与测试' },
    component: () => import('@/views/canvasView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
