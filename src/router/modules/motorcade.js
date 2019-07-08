import Layout from '@/layout'

const motorcadeRouter = {
  path: '/',
  component: Layout,
  name: 'motorcade',
  alwaysShow: false,
  meta: { title: '车队信息', icon: 'nested' },
  redirect: { name: 'carInfo' },
  children: [
    {
      path: 'financeManage',
      name: 'financeManage',
      component: () => import('@/views/carList/financeManage/index'),
      meta: { title: '财务管理' },
      children: []
    },
    {
      path: 'carInfo',
      component: () => import('@/views/carList/carManage/carInfo'),
      name: 'carInfo',
      meta: { title: '车辆管理'}
    },
    {
      path: 'addCarInfo',
      component: () => import('@/views/carList/carManage/addcarInfo'),
      name: 'addCarInfo',
      meta: { title: '添加车辆管理' },
      hidden: true
    },
    {
      path: 'driverInfo',
      component: () => import('@/views/carList/driverInfo/dreverInfo.vue'),
      name: 'driverInfo',
      meta: { title: '司机信息' }
    },
    {
      path: 'AddDriverInfo',
      component: () => import('@/views/carList/driverInfo/addDrever.vue'),
      name: 'AddDriverInfo',
      meta: { title: '添加司机信息' },
      hidden: true
    },
    {
      path: 'totalTable',
      component: () => import('@/views/carList/orderTotalTable/totalTable'),
      name: 'totalTable',
      meta: { title: '订单总表' }
    },
    {
      path: 'wareHouseInfo',
      name: 'wareHouseInfo',
      meta: { title: '仓库信息' },
      redirect: { name: 'comeWareHouse' },
      component: () => import('@/views/carList/wareHouse/index'),
      children: [
        {
          path: 'comeWareHouse',
          component: () => import('@/views/carList/wareHouse/comeWareHouse'),
          name: 'comeWareHouse',
          meta: { title: '入库记录' }
        },
        {
          path: 'outWareHouse',
          component: () => import('@/views/carList/wareHouse/outWareHouse'),
          name: 'outWareHouse',
          meta: { title: '出库记录' }
        }
      ]
    }
  ]
}

export default motorcadeRouter
