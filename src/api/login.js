//Mosen 登录接口
import request from './../utils/request'

export function loginT(data) {
  return request({
    baseURL:'',
    url: '/api/login',
    method: 'post',
    data
  })
}
