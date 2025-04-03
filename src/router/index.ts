import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/Blog/Blog.vue')
        },
        {
          path: 'blog/:id',
          name: 'blog-post',
          component: () => import('@/views/Blog/BlogPost.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/About/index.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/Error/error404.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
