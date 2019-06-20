import request from '../../utils/request'

// 添加客户信息
export function clientAdd(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/add',
    method: mtd,
    data
  })
}
// api/customer/search

export function clientSearch(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/search',
    method: mtd,
    data
  })
}
