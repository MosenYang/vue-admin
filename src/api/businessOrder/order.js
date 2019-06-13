//Mosen 开发
import request from './../../utils/request'

//获取订单头信息
export function getOrderMsg(data) {
  return request({
    baseURL:'',
    url: '/api/orders/create',
    method: 'GET',
    data
  })
}
//创建订单
export function createOrder(data) {
  return request({
    baseURL:'',
    url: '/api/orders',
    method: 'post',
    data
  })
}
// 订单列表
export function orderIndex(data) {
  return request({
    baseURL:'',
    url: '/api/order/index',
    method: 'post',
    data
  })
}
// options 搜索
export function getOrderInfo(data) {
  return request({
    baseURL:'',
    url: '/api/order/getOrderInfo',
    method: 'post',
    data
  })
}
