import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS 重置

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'

import './icons'
import './permission' // 权限js
import './utils/error-log' //错误日志

import * as filters from './filters' //全局的过滤方法

/**
 * 线上环境请关闭mock
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  // mockXHR()
}

// 设置element-ui 默认尺寸
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
