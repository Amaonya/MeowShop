import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', component: Login },

  { path: '/home', component: Home },
]

const router = new VueRouter({ routes })

router.beforeEach((to, _, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token为空 那么强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
