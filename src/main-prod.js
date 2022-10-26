import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'

import VueQuillEditor from 'vue-quill-editor'


import dayjs from 'dayjs'
import axios from 'axios'

import NProgress from 'nprogress'

// axios请求拦截 发请求的时候调用request，请求响应完毕调response
axios.interceptors.request.use(config => {
  // 为请求头添加Token验证的Authorization字段
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 一定要return
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
 
})


// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.dayjs = dayjs

Vue.config.productionTip = false

Vue.use(VueQuillEditor, /* { default global options } */)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
