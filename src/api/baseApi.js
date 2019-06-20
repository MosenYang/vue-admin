import request from '../utils/request'

// 基础搜索
export function searchType(data, method) {
  let mtd = method ? method : 'post'
  return request({
    baseURL: '',
    url: '/api/utils/search',
    method: mtd,
    data
  })
}
