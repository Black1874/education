import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/learning',
      name: 'learning',
      component: () => import('@/modules/block1/views/learning/LearningList.vue')
    },
    {
      path: '/learning/:category',
      name: 'learning-detail',
      component: () => import('@/modules/block1/views/learning/LearningInteractive.vue')
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/modules/block1/views/games/GameList.vue')
    },
    {
      path: '/games/:gameId',
      name: 'game-detail',
      component: () => import('@/modules/block1/views/games/GameDetail.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    }
  ]
})

export default router
