import request from '../../../utils/request'

//已入库订单
export function truck(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck',
    method: 'post',
    data
  })
}

//添加运输线路
export function add(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/add',
    method: 'post',
    data
  })
}
//运输线路列表
export function transportLineList(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/list',
    method: 'post',
    data
  })
}
// 修改中转归属地
export function changeMiddle(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/ajax',
    method: 'post',
    data
  })
}
// 改运费付款方式
export function changePayMethod(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/ajax',
    method: 'post',
    data
  })
}
// 修改运费
export function alterFreight(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/ajax',
    method: 'post',
    data
  })
}
// 改线路
export function editLine(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/edit',
    method: 'post',
    data
  })
}
// 删除线路
export function deleteLine(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/truck/del',
    method: 'post',
    data
  })
}

