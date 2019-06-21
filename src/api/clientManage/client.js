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

// 列表数据
export function clientSearch(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/search',
    method: mtd,
    data
  })
}

// 列表删除
export function deleteSearch(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/delete',
    method: mtd,
    data
  })
}
//编辑
export function updateSearch(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/update',
    method: mtd,
    data
  })
}

// 修改维护人
export function updateAccendant(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/accendant/update',
    method: mtd,
    data
  })
}
