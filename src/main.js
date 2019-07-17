import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import './icons'
import './permission'
import './utils/error-log'

import * as filters from './filters'

import Mallki from '@/components/TextHoverEffect/Mallki'
import MdInput from '@/components/MDinput'
Vue.component('Mallki', Mallki)
Vue.component('MdInput', MdInput)

import { mockXHR } from '../mock'

if (process.env.NODE_ENV === 'production') {
  mockXHR()
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
