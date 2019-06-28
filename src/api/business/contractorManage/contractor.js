import request from '../../../utils/request'

//列表
export function contractorList(data) {
  return request({
    baseURL: '',
    url: '/api/carrier/search',
    method: 'post',
    data
  })
}

//删除
export function contractorRegister(data) {
  return request({
    baseURL: '',
    url: '/api/user/register',
    method: 'post',
    data
  })
}

//添加 承运商
export function contractorAdd(data) {
  return request({
    baseURL: '',
    url: '/api/carrier/add',
    method: 'post',
    data
  })
}

//更新 承运商
export function contractorUpdate(data) {
  return request({
    baseURL: '',
    url: '/api/carrier/update',
    method: 'post',
    data
  })
}
