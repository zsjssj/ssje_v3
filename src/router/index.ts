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
    component: () => import('@v/Home/index.vue')
  },
  {
    path: '/about',
    name: 'about',
    meta: { title: '关于' },
    redirect: '/about/arcgis',
    component: () => import('@v/About/index.vue'),
    children: [
      {
        path: '/about/three3d',
        name: 'three3d',
        meta: { title: '模型3d' },
        component: () => import('@v/Three/index.vue')
      },
      {
        path: '/about/cesium',
        name: 'cesium',
        meta: { title: '地理3D' },
        component: () => import('@v/Cesium/index.vue')
      },
      {
        path: '/about/echart',
        name: 'echart',
        meta: { title: '图表地图' },
        component: () => import('@v/Echart/index.vue')
      },
      {
        path: '/about/amap',
        name: 'amap',
        meta: { title: '高德地图' },
        component: () => import('@v/Amap/index.vue')
      },
      {
        path: '/about/arcgis',
        name: 'arcgis',
        meta: { title: 'arcgisapi for js' },
        component: () => import('@v/Arcgis/index.vue')
      }
    ]
  },
  {
    path: '/learn',
    name: 'learn',
    meta: { title: '知识点' },
    component: () => import('@v/Learn/index.vue')
  },
  {
    path: '/canvas',
    name: 'canvas',
    meta: { title: '技术尝试与测试' },
    component: () => import('@v/TryPlay/canvasView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
