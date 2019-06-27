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
export function deleteList(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/delete',
    method: mtd,
    data
  })
}

//编辑
export function updateList(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/update',
    method: mtd,
    data
  })
}

// 客户导出
export function exportCustomer(data) {
  return request({
    baseURL: '',
    url: '/api/customer/export',
    method: 'get',
    responseType: 'blob'
  })
}

//批量导入
export function importCustomer(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/import',
    method: mtd,
    data
  })
}

//模板导出
export function template(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/template',
    method: mtd,
    data
  })
}

//维护记录添加
export function logsAdd(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/logs/add',
    method: mtd,
    data
  })
}

//维护记录查看
export function logsShow(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/logs/show',
    method: mtd,
    data
  })
}

//客户审核
export function auditClient(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/customer/audit',
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
