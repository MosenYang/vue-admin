//Mosen 开发 测试接口
import request from './../utils/request'

export function testLogin(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}
