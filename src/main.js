import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// 引入字体的文件
import '@/assets/font/iconfont.css'
// 引入全局的样式文件
import '@/assets/css/global.less'

import SocketService from '@/utils/socket_service'
import axios from 'axios'
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://lengnuanit.top:9999/api/'
// axios.defaults.baseURL = 'http://localhost:9999/api/'
SocketService.Instance.connect()
Vue.prototype.$api = axios
Vue.prototype.$echarts = window.echarts
Vue.prototype.$socket = SocketService.Instance
console.log(Vue.prototype.$socket);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
