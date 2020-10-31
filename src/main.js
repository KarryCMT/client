import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入字体的文件
import '@/assets/font/iconfont.css'
// 引入全局的样式文件
import '@/assets/css/global.less'
import axios from 'axios'
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://lengnuanit.top:8888/api/'
Vue.prototype.$api = axios
Vue.prototype.$echarts = window.echarts
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
