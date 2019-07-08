import Layout from '@/layout'

const businessRouter = {
  path: '/business',
  component: Layout,
  name: 'business',
  alwaysShow: false,
  meta: { title: '我的业务', icon: 'nested'},
  redirect: { name: 'businessTotalTable' },
  children: [
    {
      path: 'businessOrderManage',
      component: () => import('@/views/business/businessOrderManage/index'),
      name: 'businessOrderManage',
      meta: { title: '订单管理' },
      children: [
        {
          path: 'businessOrderTable',
          component: () => import('@/views/business/businessOrderManage/orderTable/index'),
          name: 'businessOrderTable',
          redirect: { name: 'businessTotalTable' },
          meta: { title: '订单总表', roles: ['admin', 'editor'] },
          children: [
            {
              path: 'businessTotalTable',
              component: () => import('@/views/business/businessOrderManage/orderTable/totalTable'),
              name: 'businessTotalTable',
              meta: { title: '订单总表' }
            },
            {
              path: 'businessCreateOrder',
              component: () => import('@/views/business/businessOrderManage/orderTable/createOrder'),
              name: 'businessCreateOrder',
              meta: { title: '创建订单' },
              hidden: true
            },
            {
              path: 'businessAlterOrder',
              component: () => import('@/views/business/businessOrderManage/orderTable/alterOrder'),
              name: 'businessAlterOrder',
              meta: { title: '修改订单' },
              hidden: true
            },
            {
              path: 'businessOrderInfo',
              component: () => import('@/views/business/businessOrderManage/orderTable/orderInfo'),
              name: 'businessOrderInfo',
              meta: { title: '订单详情' },
              hidden: true
            }
          ]
        },
        {
          path: 'feedbackOrderInfo',
          component: () => import('@/views/business/businessOrderManage/feedbackOrderInfo/feedbackOrderTable'),
          name: 'feedbackOrderInfo',
          meta: { title: '回单信息' }
        },
        {
          path: 'freightCheckTable',
          component: () => import('@/views/business/businessOrderManage/freightCheck/freightCheckTable'),
          name: 'freightCheckTable',
          meta: { title: '运费校验' }
        },
        {
          path: 'kickbackOrder',
          component: () => import('@/views/business/businessOrderManage/kickbackOrder/kickbackOrder'),
          name: 'kickbackOrder',
          meta: { title: '订单回扣' }
        },
        {
          path: 'lossOrder',
          component: () => import('@/views/business/businessOrderManage/lossOrder/lossOrder'),
          name: 'lossOrder',
          meta: { title: '亏损订单' }
        },
        {
          path: 'offerInfo',
          component: () => import('@/views/business/businessOrderManage/offerInfo/offerInfo'),
          name: 'offerInfo',
          meta: { title: '报价信息' }
        },
        {
          path: 'pushMoney',
          component: () => import('@/views/business/businessOrderManage/pushMoney/pushMoney'),
          name: 'pushMoney',
          meta: { title: '业务提成' }
        }
      ]
    },
    {//运输管理
      path: 'transportManage',
      name: 'transportManage',
      component: () => import('@/views/business/transportManage/index'),
      meta: { title: '运输管理' },
      redirect: { name: 'transportTable' },
      children: [
        {
          path: 'transportInfo',
          component: () => import('@/views/business/transportManage/transportInfo/index'),
          meta: { title: '运输信息' },
          redirect: '/transportManage/transportInfo/transportDetail',
          children: [
            {
              path: 'transportTable',
              component: () => import('@/views/business/transportManage/transportInfo/transportTable'),
              name: 'transportTable',
              meta: { title: '运输明细表' }
            },
            {
              path: 'transportDetail',
              component: () => import('@/views/business/transportManage/transportInfo/transportInfo'),
              name: 'transportDetail',
              meta: { title: '运输详情' }
            }
          ]
        },
        {
          path: 'bringAndSendTable',
          component: () => import('@/views/business/transportManage/bringAndSendInfo/bringAndSendTable'),
          name: 'bringAndSendTable',
          meta: { title: '提送信息表' }
        },
        {
          path: 'loadingArrange',
          component: () => import('@/views/business/transportManage/loadingArrange/loadingArrange'),
          name: 'loadingArrange',
          meta: { title: '装车排版' }
        },
        {
          path: 'GpsMap',
          component: () => import('@/views/business/transportManage/GPS/GpsMap'),
          name: 'GpsMap',
          meta: { title: 'GPS地图' }
        }
      ]
    },
    {//客户管理
      path: 'clientManage',
      name: 'clientManage',
      component: () => import('@/views/business/clientManage/index'),
      meta: { title: '客户管理' },
      redirect: { name: 'clientInfo' },
      children: [
        {
          path: 'clientInfo',
          component: () => import('@/views/business/clientManage/clientInfo'),
          name: 'clientInfo',
          meta: { title: '客户信息表' }
        },
        {
          path: 'createClientInfo',
          component: () => import('@/views/business/clientManage/createClientInfo'),
          name: 'createClientInfo',
          meta: { title: '创建客户信息' }
        }
      ]
    },
    {//承运商管理
      path: 'contractorManage',
      name: 'contractorManage',
      component: () => import('@/views/business/contractorManage/index'),
      meta: { title: '承运商管理' },
      redirect: { name: 'contractorInfo' },
      children: [
        {
          path: 'contractorInfo',
          component: () => import('@/views/business/contractorManage/contractorInfo/contractorInfo'),
          name: 'contractorInfo',
          meta: { title: '承运商信息' },
          children: []
        },
        {
          path: 'transportCarInfo',
          component: () => import('@/views/business/contractorManage/transportCarInfo/transportCarInfo'),
          name: 'transportCarInfo',
          meta: { title: '运输车信息' }
        },
        {
          path: 'concatCarInfo',
          component: () => import('@/views/business/contractorManage/concatCarInfo/concatCarInfo'),
          name: 'concatCarInfo',
          meta: { title: '提送车信息' }
        },
        {
          path: 'sendCarPrice',
          component: () => import('@/views/business/contractorManage/sendCarPrice/sendCarPrice'),
          name: 'sendCarPrice',
          meta: { title: '提送报价信息' }
        },

        {
          path: 'transportPrice',
          component: () => import('@/views/business/contractorManage/transportPrice/transportPrice'),
          name: 'transportPrice',
          meta: { title: '运输报价信息' }
        },
        {
          path: 'addSendCarPrice',
          component: () => import('@/views/business/contractorManage/sendCarPrice/addSendCarPrice'),
          name: 'addSendCarPrice',
          meta: { title: '添加提送报价' },
          hidden: true
        },
        {
          path: 'addContractor',
          component: () => import('@/views/business/contractorManage/contractorInfo/addContractor'),
          name: 'addContractor',
          meta: { title: '添加承运商' },
          hidden: true
        },
        {
          path: 'addTransportCar',
          component: () => import('@/views/business/contractorManage/transportCarInfo/addTransportCar'),
          name: 'addTransportCar',
          meta: { title: '添加运输车' },
          hidden: true
        },
        {
          path: 'addConcatCarInfo',
          component: () => import('@/views/business/contractorManage/concatCarInfo/addConcatCarInfo'),
          name: 'addConcatCarInfo',
          meta: { title: '添加接送车' },
          hidden: true
        },
        {
          path: 'addTransportPrice',
          component: () => import('@/views/business/contractorManage/transportPrice/addTransportPrice'),
          name: 'addTransportPrice',
          meta: { title: '添加运输报价' },
          hidden: true
        }
      ]
    },
    {
      path: 'businessOrderShow',
      component: () => import('@/views/business/businessOrderManage/orderTable/orderTotalShow'),
      name: 'businessOrderShow',
      meta: { title: '测试页' }
    },
    {
      path: 'businessOrderShow2',
      component: () => import('@/views/business/businessOrderManage/orderTable/orderTotalShow2'),
      name: 'businessOrderShow2',
      meta: { title: '测试页2' }
    }
  ]
}

export default businessRouter
