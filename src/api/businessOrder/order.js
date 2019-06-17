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
// 订单总列表
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


// 编辑订单 api/orders/7/edit
export function editOrder(data) {
  return request({
    baseURL:'',
    url: 'api/orders/7/edit',
    method: 'get',
    data
  })
}

// 修改订单
export function alterOrder(data) {
  return request({
    baseURL:'',
    url: '/api/order/update',
    method: 'post',
    data
  })
}
