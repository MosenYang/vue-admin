import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
// url:"http://api.thisyang.online/api/products"
// headers: {
//   Accept: "application/json",
//   Authorization:"Bearer... "
// }
console.log('环境变量?', process.env.VUE_APP_BASE_API, process.env.NODE_ENV)
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 跨域发送请求
  timeout: 5000
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
service.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })
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
