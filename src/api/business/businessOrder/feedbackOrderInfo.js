// 回单接口
import request from '../../../utils/request'
// 接口文档没更新
export function getOrderMsg(data) {
  return request({
    baseURL: '',
    url: '/api/orders/create',
    method: 'GET',
    data
  })
}
