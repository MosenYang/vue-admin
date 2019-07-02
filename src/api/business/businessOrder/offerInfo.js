//报价信息
import request from '../../../utils/request'

//获取订单头信息
// get 方法语法有变化
export function getPrice(data) {
  return request({
    baseURL: '',
    url: '/api/order/getPrice',
    method: 'GET',
    params: data
  })
}
