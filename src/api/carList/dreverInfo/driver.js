import request from '../../../utils/request'
// 运输信息
//添加
export function addDriver(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/add',
    method: 'post',
    data
  })
}

//列表
export function driverList(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/info',
    method: 'get',
    params: data
  })
}

//删除
export function deleteDriver(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/delete',
    method: 'post',
    data
  })
}

//编辑 详情
export function updateDriver(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/update',
    method: 'get',
    params: data
  })
}

//编辑 保存
export function updateDriver2(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/update',
    method: 'post',
    data
  })
}

//删除
export function deleteFile(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/deleteFile',
    method: 'get',
    params: data
  })
}

//导出
export function exportFile(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/driver/export',
    method: 'POST',
    data
  })
}
