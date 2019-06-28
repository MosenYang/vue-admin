import request from '../../../utils/request'
//列表
export function concatCarList(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/search',
    method: 'post',
    data
  })
}
// 添加
export function addConcatCarList(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/add',
    method: 'post',
    data
  })
}
// 更新
export function updateConcatCar(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteConcatCar(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/delete',
    method: 'post',
    data
  })
}

// 上传
export function uploadConcatCar(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/update',
    method: 'post',
    data
  })
}

// 凭证删除
export function imgDelete(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/img/del',
    method: 'post',
    data
  })
}
// 导入模板
export function templateDownLoad(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/template',
    method: 'post',
    data
  })
}
// 车辆信息导出
export function infoExport(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/export',
    method: 'post',
    data
  })
}
// 车辆信息导入
export function infoImport(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/import',
    method: 'post',
    data
  })
}

//提送车入库权限修改
export function warehousing(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/warehousing',
    method: 'post',
    data
  })
}
//提送车验车权限修改
export function driverValidate(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/driverValidate',
    method: 'post',
    data
  })
}
// 黑名单 操作
export function blacklist(data) {
  return request({
    baseURL: '',
    url: '/api/delivery/blacklist',
    method: 'post',
    data
  })
}
