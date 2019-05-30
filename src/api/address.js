import request from './../utils/request'

export function testLogin(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}
