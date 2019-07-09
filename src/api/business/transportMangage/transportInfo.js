import request from '../../../utils/request'
// 运输信息
//列表
export function transportInfoList(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/lists',
    method: 'post',
    data
  })
}
//发车添加
export function transportAdd(data) {
  return request({
    baseURL: '',
    url: '/api/order/receipt/add',
    method: 'post',
    data
  })
}
//添加在途
export function transportOnway(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/add/onway',
    method: 'post',
    data
  })
}
//修改备注
export function alterRemark(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/update/remark',
    method: 'post',
    data
  })
}
//修改中转/改费/修改备注/
export function transfer(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/loading/ajax',
    method: 'post',
    data
  })
}
//导出合同
export function transferExport(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/word/export',
    method: 'post',
    data
  })
}

//补装车列表
export function transportLoading(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/add/loading',
    method: 'post',
    data
  })
}



//**********************************
//运输明细
export function transInfoList(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/info',
    method: 'post',
    data
  })
}
//填写运费
export function addTransportPrice(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/handle',
    method: 'post',
    data
  })
}
//卸载
export function unload(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/handle',
    method: 'post',
    data
  })
}

//复验
export function againCheck(data) {
  return request({
    baseURL: '',
    url: '/api/order/update/status',
    method: 'post',
    data
  })
}
//中转/结算方式/删除
export function transferType(data) {
  return request({
    baseURL: '',
    url: '/api/waybill/handle',
    method: 'post',
    data
  })
}
//回滚/到达/自提/送车/交车/
export function transferStatus(data) {
  return request({
    baseURL: '',
    url: '/api/order/update/status',
    method: 'post',
    data
  })
}
