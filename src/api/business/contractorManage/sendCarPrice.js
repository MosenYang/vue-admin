import request from '../../../utils/request'
//列表
export function sendCarPriceList(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/quotation/search',
    method: 'post',
    data
  })
}
//添加
export function addCarPrice(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/quotation/add',
    method: 'post',
    data
  })
}

//编辑
export function editCarPrice(data) {
  return request({
    baseURL: '',
    url: '/api/user/register',
    method: 'post',
    data
  })
}
//删除
export function deleteCarPrice(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/quotation/delete',
    method: 'post',
    data
  })
}
//导入模板下载
export function templateDownLoad(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/quotation/template',
    method: 'post',
    data
  })
}
// 提送报价批量导入
export function templateImport(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/quotation/import',
    method: 'post',
    data
  })
}
// 提送报价批量导出
export function templateExport(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/quotation/export',
    method: 'post',
    data
  })
}
