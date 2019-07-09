import request from '../../../utils/request'
// 运输信息
//列表
export function carInfoList(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/info',
    method: 'get',
    params: data
  })
}

// 司机模糊匹配
export function checkName(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/add',
    method: 'get'
  })
}

// 修改/添加车辆信息 (表单)
export function addNewCar(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/add',
    method: 'post',
    data
  })
}

// 删除当前行
export function deleteCar(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/delete',
    method: 'post',
    data
  })
}

// 编辑表单
export function editNewCar(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/update',
    method: 'get',
    params: data
  })
}

//导出
export function exportCar(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/export',
    method: 'post',
    data
  })
}

// 上传
export function uoLoadFile(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/file',
    method: 'post',
    data
  })
}

// 图片删除
export function deleteFile(data) {
  return request({
    baseURL: '',
    url: '/api/hxd/vehicle/deleteFile',
    method: 'get',
    params: data
  })
}
