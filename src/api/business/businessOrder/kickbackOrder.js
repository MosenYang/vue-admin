// 回扣接口
import request from '../../../utils/request'

// 回扣信息表
export function kickbackList(data) {
  return request({
    baseURL: '',
    url: '/api/orderex/discount',
    method: 'POST',
    data
  })
}
// 审核
export function kickbackCheck(data) {
  return request({
    baseURL: '',
    url: '/api/order/check_order',
    method: 'POST',
    data
  })
}
