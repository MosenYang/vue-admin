import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // 跨域
  timeout: 8000,
  headers: {
    Accept: 'application/json',
    Authorization: localStorage.getItem('suoBang-token') ? 'Bearer ' + localStorage.getItem('suoBang-token') : ''// 记得要拼接空格
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
    console.log(error)
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(response => {
    const res = response.data
    if (!res.code) return res //导出表格
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
      if (res.code === 401) {
        Message({
          message: 'token异常',
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
        }).then(() => {// 重新登录
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      //抛异常处理
      return Promise.reject(res)
    }
    // 正常
    Message({
      message: '接口成功',
      type: 'success',
      duration: 1000
    })
    return res
  },
  error => {
    console.log('错误信息:' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
