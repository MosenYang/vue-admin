import request from '../utils/request'

// 基础搜索
export function searchType(data, method) {
  let mtd = method ? method : 'post'
  let param = mtd == 'get' ? { params: data } : data
  return request({
    baseURL: '',
    url: '/api/utils/search',
    method: 'post',
    param
  })
}

// 上传图片
export function uploadPic(data) {
  return request({
    baseURL: '',
    url: '/api/utils/upload_file',
    method: 'post',
    data
  })
}
