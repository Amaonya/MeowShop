import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import dayjs from 'dayjs'
import axios from 'axios'

// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 一定要return
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
