// 回扣接口
import request from '../../../utils/request'

// 表list
export function pushMoneyList(data) {
  return request({
    baseURL: '',
    url: '/api/orderex/business',
    method: 'POST',
    data
  })
}

// 审核
export function checkPushMoney(data) {
  return request({
    baseURL: '',
    url: '/api/utils/audit',
    method: 'POST',
    data
  })
}
// 导出
export function exportPushMoney(data) {
  return request({
    baseURL: '',
    responseType:"blob",
    url: '/api/orderex/business/export',
    method: 'POST',
    data
  })
}
// 修改
export function alterPushMoney(data) {
  return request({
    baseURL: '',
    url: '/api/orderex/business/sysprice',
    method: 'POST',
    data
  })
}
