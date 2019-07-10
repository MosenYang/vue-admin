import request from '../../../utils/request'

//获取车牌信息
export function plateNumber(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/gps',
    method: 'post',
    data
  })
}

// 获取车辆详情
export function getCar(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/gps/getcar',
    method: 'post',
    data
  })
}

// 装车页面
export function loading(data) {
  return request({
    baseURL: '',
    url: '/api/order/more/car',
    method: 'post',
    data
  })
}

// 装车列表
export function loadingList(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/add/loading',
    method: 'post',
    data
  })
}

// 补装车
export function loadingList2(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/loading/ajax',
    method: 'post',
    data
  })
}


// 发车
export function gpsAdd(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/add',
    method: 'post',
    data
  })
}

// 通过车牌获取车辆信息
export function gpsStatus(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/gps/status',
    method: 'post',
    data
  })
}
