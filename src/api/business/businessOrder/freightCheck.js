// 回扣接口
import request from '../../../utils/request'

// 校验表
export function checkOrder(data) {
  return request({
    baseURL: '',
    url: '/api/order/freight',
    method: 'POST',
    data
  })
}
// 填写校验表
export function checkAction(data) {
  return request({
    baseURL: '',
    url: '/api/order/freight/check',
    method: 'POST',
    data
  })
}
