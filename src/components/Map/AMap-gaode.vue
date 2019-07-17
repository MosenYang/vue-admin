<template>
  <div class="page">
    <div class="map-container">
      <div id="container" class="container"></div>
      <div class="control"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import {
    plateNumber,
    gpsStatus,
    gpsAdd,
    loadingList2,
    loadingList,
    getCar
  } from '../../api/business/transportMangage/gps'

  export default {
    components: {},
    data() {
      return {
        mapData: [],
        defParams: defParams,
        map: null
      }
    },
    props: {},
    computed: {},
    watch: {},
    created() {
      this.getCarList()
    },
    mounted() {
      this.mapInit()

    },
    methods: {
      mapInit() {
        let map
        this.map = map = new AMap.Map('container', {
          zoom: 11,//级别
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: [116.397428, 39.90923],//中心点坐标
          viewMode: '3D'//使用3D视图
        })
        AMap.plugin(['AMap.ToolBar', 'AMap.Driving', 'AMap.PlaceSearch', 'AMap.Transfer'], function () {//异步加载插件
          var toolbar = new AMap.ToolBar()
          map.addControl(toolbar)
          var driving = new AMap.Driving()//驾车路线规划
          driving.search(/*参数*/)
        })
      },
      getCarList() {
        loadingList(this.defParams).then((res) => {
          if (res.code == 200) {
            let {
              orders_data,
              payment_method,
              type_of_business,
              freight_settlement_method,
              pagesize, total_count
            } = res.data
            console.log('地图', res.data)
          }
        })
        // plateNumber().then((res) => {
        //   console.log('获取车牌', res)
        // })
        // gpsStatus().then((res) => {
        // })
      },
      getMap() {}
    }
  }
  var defParams = {
    query: '',// 搜索字段
    start: 1,
    length: 10,// 条数
    order_num: '',
    create_order_time_start: '',
    create_order_time_end: '',
    who_handle_name: '',
    start_city_string: '',
    end_city_string: '',
    consignor: '',
    consignor_mobile: '',
    consignee: '',
    consignee_mobile: '',
    car_brand_name: '',
    heading_code: '',
    payment_method: '',
    operator: '',
    type_of_business: ''
  }

</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 600px;
    border: 1px solid red;
  }
</style>
