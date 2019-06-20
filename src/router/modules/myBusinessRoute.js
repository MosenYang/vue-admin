import Layout from '@/layout'

const businessRouter = {
  path: '/business',
  component: Layout,
  redirect: '/business',
  name: 'business',
  alwaysShow: false,
  meta: { title: '我的业务', icon: 'nested' },
  children: [
    {
      path: 'businessOrderManage',
      component: () => import('@/views/business/businessOrderManage/index'),
      name: 'businessOrderManage',
      meta: { title: '订单管理' },
      redirect: 'businessOrderManage',
      children: [
        {
          path: 'businessOrderTable',
          component: () => import('@/views/business/businessOrderManage/orderTable/index'),
          name: 'businessOrderTable',
          redirect: 'businessTotalTable',
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
              meta: { title: '创建订单' }
            },
            {
              path: 'businessAlterOrder',
              component: () => import('@/views/business/businessOrderManage/orderTable/alterOrder'),
              name: 'businessAlterOrder',
              meta: { title: '修改订单' }
            },
            {
              path: 'businessOrderInfo',
              component: () => import('@/views/business/businessOrderManage/orderTable/orderInfo'),
              name: 'businessOrderInfo',
              meta: { title: '订单详情' }
            }
          ]
        },
        {
          path: 'businessOrderShow',
          component: () => import('@/views/business/businessOrderManage/orderTable/orderTotalShow'),
          name: 'businessOrderShow',
          meta: { title: '测试页' }
        }
      ]
    },
    {//运输管理
      path: 'transportManage',
      name: 'transportManage',
      component: () => import('@/views/business/transportManage/GpsCharsManage'),
      meta: { title: '运输管理' }
    },
    {//客户管理路由
      path: 'clientManage',
      name: 'clientManage',
      component: () => import('@/views/business/clientManage/index'),
      meta: { title: '客户管理' },
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
    }
  ]
}

export default businessRouter
