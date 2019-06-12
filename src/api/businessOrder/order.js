//Mosen 开发
import request from './../../utils/request'

//订单头信息
export function OrderMsg(data) {
  return request({
    url: '/api/orders/create',
    method: 'get',
    data
  })
}
//创建订单
export function order(data) {
  return request({
    url: '/api/orders',
    method: 'post',
    data
  })
}
// 订单列表
export function orderIndex(data) {
  return request({
    url: '/api/order/index',
    method: 'post',
    data
  })
}
// options 搜索
export function getOrderInfo(data) {
  return request({
    url: '/api/order/getOrderInfo',
    method: 'post',
    data
  })
}
