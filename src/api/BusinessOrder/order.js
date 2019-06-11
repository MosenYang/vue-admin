//Mosen 开发
import request from './../../utils/request'

//创建订单
export function createOrder(data) {
  return request({
    url: '/api/orders/create',
    method: 'get',
    data
  })
}
