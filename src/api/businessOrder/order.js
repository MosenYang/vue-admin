//Mosen 开发
import request from './../../utils/request'

/**
 * 创建订单页面
 * @param data
 * @returns {AxiosPromise}
 */
//获取订单头信息
export function getOrderMsg(data) {
  return request({
    baseURL: '',
    url: '/api/orders/create',
    method: 'GET',
    data
  })
}

//创建订单
export function createOrder(data) {
  return request({
    baseURL: '',
    url: '/api/orders',
    method: 'post',
    data
  })
}

// options 搜索
export function getOrderInfo(data) {
  return request({
    baseURL: '',
    url: '/api/order/getOrderInfo',
    method: 'post',
    data
  })
}

/**
 *  订单总列表接口
 * **/
export function orderIndex(data) {
  return request({
    baseURL: '',
    url: '/api/order/index',
    method: 'post',
    data
  })
}

// 删除订单
export function destroyOrder(data) {
  return request({
    baseURL: '',
    url: '/api/order/destroy',
    method: 'post',
    data
  })
}

//订单审核
export function checkOrder(data) {
  return request({
    baseURL: '',
    url: '/api/order/check_order',
    method: 'post',
    data
  })
}

/**
 * 修改订单
 * **/
// 展示修改
export function editOrder(data) {
  return request({
    baseURL: '',
    url: '/api/order/edit/' + data.id,
    method: 'get'
  })
}

// 提交修改
export function alterOrder(data) {
  return request({
    baseURL: '',
    url: '/api/order/update',
    method: 'post',
    data
  })
}


