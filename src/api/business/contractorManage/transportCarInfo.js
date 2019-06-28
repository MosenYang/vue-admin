import request from '../../../utils/request'

//列表
export function transportList(data) {
  return request({
    baseURL: '',
    url: '/api/transport/search',
    method: 'post',
    data
  })
}

//新增
export function transportAdd(data) {
  return request({
    baseURL: '',
    url: '/api/transport/add',
    method: 'post',
    data
  })
}

//编辑
export function transportUpdate(data) {
  return request({
    baseURL: '',
    url: '/api/transport/update',
    method: 'post',
    data
  })
}

//删除
export function transportDelete(data) {
  return request({
    baseURL: '',
    url: '/api/transport/delete',
    method: 'post',
    data
  })
}

//运输车辆凭证上传
export function transportUpload(data) {
  return request({
    baseURL: '',
    url: '/api/transport/upload',
    method: 'post',
    data
  })
}
