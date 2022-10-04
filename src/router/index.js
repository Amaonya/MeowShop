import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue';
import Rights from '../components/right/Rights.vue'
import Roles from '../components/right/Roles.vue'


import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: Login
  },

  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _, next) => {
  NProgress.start()
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token为空 那么强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
