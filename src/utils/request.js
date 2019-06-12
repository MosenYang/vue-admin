import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const defaultSettings = require('@/settings.js')

// 索邦接口
// url:"http://api.thisyang.online/api/products"
// headers: {
//   Accept: "application/json",
//   Authorization:"Bearer... "
// }

console.log('vue环境api', process.env.VUE_APP_BASE_API)
// console.log('索邦环境api', process.env.SUO_BANG_BASE_API)
// console.log('索邦环境url', process.env.SUO_BANG_BASE_URL)

/*
*请求线上地址 还需要两步骤 //process.env.VUE_APP_BASE_API
* 1.去掉baseUrl, 2.去掉mock文件夹的相关路由
*/
const service = axios.create({
  // 为什么没有.因为我需要切换mock和线上地址, 把地址分成两段了,完整url在代理里面拼接了,中间这段就省去
  baseURL:'',
  withCredentials: true, // 跨域发送请求
  timeout: 8000,
  headers: {
    Accept: 'application/json',
    Authorization: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  }
})

// 请求拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
// 兼容mock 和线上接口200/400状态 (Mosen 添加)
service.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== 20000 && res.code !== 200) {
      Message({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 400) {
        Message({
          message: '接口400了',
          type: 'warning',
          duration: 1000
        })
      }
      // 50008: 无效token; 50012: 其他客户端登录; 50014: 登录超时;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你可以取消,也可以重新登录!', 'Confirm logout', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 重新登录
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      Message({
        message: '接口成功',
        type: 'success',
        duration: 1000
      })
      return res
    }
  },
  error => {
    console.log('错误信息:' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
