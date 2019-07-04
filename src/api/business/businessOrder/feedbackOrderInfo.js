// 回单接口
import request from '../../../utils/request'

// 添加回单
export function addFeedback(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/add',
    method: 'POST',
    data
  })
}

// 回单信息表
export function getFeedbackList(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/index',
    method: 'POST',
    data
  })
}

// 编辑回单详情
export function FeedbackInfo(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/editpage',
    method: 'POST',
    data
  })
}

// 提交新的编辑
export function commitFeedback(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/edit',
    method: 'POST',
    data
  })
}

// 查看
export function feedbackDetail(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/detail',
    method: 'POST',
    data
  })
}
