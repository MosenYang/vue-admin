//Mosen 开发 测试接口
import request from './../utils/request'

export function testLogin(data) {
  return request({
    baseURL:'',
    url: '/api/login',
    method: 'post',
    data
  })
}
