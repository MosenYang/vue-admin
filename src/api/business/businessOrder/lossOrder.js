// 回单接口
import request from '../../../utils/request'

// 添加回单
export function lossOrderList(data) {
  return request({
    baseURL: '',
    url: '/api/orderex/loss',
    method: 'POST',
    data
  })
}
//合理亏损
export function checkLossOrder(data) {
  return request({
    baseURL: '',
    url: '/api/orderex/loss/check',
    method: 'POST',
    data
  })
}

