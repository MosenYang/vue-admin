//报价信息
import request from '../../../utils/request'

//获取订单头信息
// get 方法语法有变化
export function getPrice(data) {
  return request({
    baseURL: '',
    url: '/api/order/getPrice?start_province=' + data.start_province + '&end_province=' + data.end_province,
    method: 'GET'
  })
}
