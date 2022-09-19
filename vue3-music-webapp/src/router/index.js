import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import('@/views/Recommend')
const Search = () => import('@/views/Search')
const Singer = () => import('@/views/Singer')
const TopList = () => import('@/views/TopList')
const SingerDetail = () => import('@/views/Singer-Detail')
const User = () => import('@/views/User')
const Album = () => import('@/views/Album')
const TopDetail = () => import('@/views/Top-Detail')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/user',
    component: User
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
