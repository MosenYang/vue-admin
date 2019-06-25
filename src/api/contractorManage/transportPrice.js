import request from '../../utils/request'
//列表
export function transportPriceList(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/search',
    method: 'post',
    data
  })
}
//编辑
export function updateTransportPrice(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/update',
    method: 'post',
    data
  })
}
//删除
export function deleteTransportPrice(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/delete',
    method: 'post',
    data
  })
}
//新曾
export function addTransportPrice(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/add',
    method: 'post',
    data
  })
}

//导入
export function template(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/template',
    method: 'post',
    data
  })
}
// 导入
export function templateImport(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/import',
    method: 'post',
    data
  })
}

// 导出
export function templateExport(data) {
  return request({
    baseURL: '',
    url: '/api/transport/quotation/export',
    method: 'post',
    data
  })
}
