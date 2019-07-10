<template>
  <div class="page">
    <baidu-map class="bm-view" ak="Um8BbQX25uFFn8kqYukNmUP5a0y9jU0y" @click="getPoint" :zoom="zoom" @ready="handler"
               :scroll-wheel-zoom="true" :center="center">
      <bm-marker :position="center" :dragging="false"
                 :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif',size: {width: 100, height: 57}}">
        <div class="list-wrap">
          <bm-label content="车辆"
                    :labelStyle="{color: 'red', fontSize : '14px'}"
                    :offset="{width: -35, height: 30}"/>
        </div>
      </bm-marker>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
    </baidu-map>
    <div class="control-tab">
      <div>我的设备</div>
      <div class="control-status flex">
        <div>闲置中:<span> </span></div>
        <div>未发车:<span> </span></div>
        <div>运输中:<span> </span></div>
        <div>未录入:<span> </span></div>
      </div>
      <div>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> 全部</span>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in groups" :key="index">
                <template slot="title">
                  <i class="header-icon el-icon-info"></i>&nbsp;&nbsp;{{item.name}}
                </template>
                <div v-for="(val,i) in item.vehicles" :key="i" class="flex car-item"
                     @click="truckCar(val)">
                  <div>{{val.name}}</div>
                  <div>
                    <div>装车</div>
                    <!--<div><span>数量:</span>|<span>状态:</span></div>-->
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="在线">在线</el-tab-pane>
          <el-tab-pane label="离线">离线</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :visible.sync="dialogShow">
      <table-components></table-components>
    </el-dialog>
  </div>
</template>
<script>
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation, BmMarker, BmLabel,BaiduMap, BmScale, BmGeolocation } from 'vue-baidu-map'
import {
  plateNumber,
  gpsStatus,
  gpsAdd,
  loadingList2,
  loadingList,
  getCar
} from '../../../../api/business/transportMangage/gps'
import tableComponents from '../../../../components/Tables/dg-table2'
//
export default {
  components: {
    BaiduMap, BmNavigation, BmMarker, tableComponents, BmLabel
  },
  props: {},
  data() {
    return {
      defParams: defParams,
      carList: [],
      groups: [],
      markerPoint: [],
      option: option,
      tableData: [],
      columnData: [],
      dialogShow: false,
      total_count: '',
      freight_settlement_method: [],
      payment_method: [],
      type_of_business: [],
      jgNameDialog: false,
      locs: [],//当前车辆的坐标信息
      center: {},
      zoom: 12.8,
      location: "北京市",
      keyword: '',  //搜索框关键词
      address: ''   //位置详细信息
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      this.getCarList()
      this.requestJS()
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
          this.tableData = orders_data
          this.payment_method = payment_method
          this.type_of_business = type_of_business
          this.type_of_business = freight_settlement_method
          this.total_count = total_count
          console.log('列表', res)
        }
      })
      plateNumber().then((res) => {
        console.log('获取车牌', res)
      })
      gpsStatus().then((res) => {

      })
    },
    truckCar(val) {
      console.log('装车', val)
      let that = this
      let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('microsoft.XMLHttp')
      xhr.open('POST', 'http://123.56.96.23:89/gpsonline/GPSAPI', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
          let groups = JSON.parse(this.response)
          console.log('groups.locs', groups.locs[0])
          that.center.lat = Number(groups.locs[0].lat)
          that.center.lng = Number(groups.locs[0].lng)
          console.log('Number(groups.locs[0].lat)', Number(groups.locs[0].lat))
          this.center = groups.locs[0].info
        }
      }
      xhr.send('version=1&method=loadLocation&vid=13245324&vKey=' + val.vKey)
    },
    mapTableTh() {
      console.log(initThData.length, '订单总表表格列数')
      initThData.forEach((item, index) => {
        let config = { ...tableConfig }
        let comConfig = { ...tableConfig.filterConfig }
        config.prop = item.key // 数据字段
        config.thIndex = index
        config.isNeed = item.isNeed == false ? false : true
        config.label = comConfig.label = item.name
        config.width = item.width ? item.width : '140'
        comConfig.filterKey = item.key
        comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        config.type = comConfig.type = item.type

        if (item.name === '黑名单') {
          let list = [
            { name: '是', key: 1 },
            { name: '否', key: 2 }
          ]
          comConfig.comData = list
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    requestJS() {
      let that = this
      let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('microsoft.XMLHttp')
      xhr.open('POST', 'http://123.56.96.23:89/gpsonline/GPSAPI', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
          let { groups } = JSON.parse(this.response)
          that.groups = groups
          console.log('groups', groups)
        }
      }
      xhr.send('version=1&method=loadVehicles&uid=2330786&uKey=6d9a7509fd48f7d58bf15a5de26bd9e3')
    },
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 12.8
    },
    getPoint(e) {
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      this.zoom = e.target.getZoom()
      console.log('点击原始', e)
    }
  }
}
var tableConfig = {
  prop: '', // 参数字段
  label: '', // 名字
  type: '', // 类型当前表头交互类型
  paramKey: '',// 对应列的接口参数,(有相同也有不同)
  hidden: false,//当前数据多.是否需要渲染
  isNeed: true,// 是否需要搜索项
  thIndex: null,// 下标
  tdComponent: null,// 表格Td 内部组件可以传
  tdConfig: {},// 表格Td 配置项
  fixed: null, // 是否固定
  width: null, // 宽度
  minWidth: '80', // 最小宽度
  resizable: true, // 拖动改变列宽度(需要在 el-table 上设置 border 属性为真)
  showOverflowTooltip: true, // 内容过长隐藏
  align: 'center', // left/center/right内容对齐方式
  headerAlign: 'center', // left/center/right 头对齐方式
  labelClassName: '', // 当前列自定义class
  sortable: false, // 是否排序
  formatter: () => {}, // 排序用字段 v-bind绑定
  filters: [], // 绑定需要条件列表 数组
  filterMethod: () => {}, // 过滤方法 v-bind绑定
  renderHeader: () => {}, // Label区域渲染  v-bind绑定
  filterConfig: {// 过滤组件
    label: null,// filter 组件的table,同表头一致
    type: null,//filter 组件的类型,同表头一致
    component: null,// 传入的组件,
    filterKey: null,//字段对应表头字段
    paramKey: null,
    placeholder: '输入姓名',
    comData: [],
    comProps: null,
    listInfo: {
      fetchData() {},
      callback: () => {}// 回调
    }
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
var option = [
  {
    value: '10',
    label: '10条/页'
  }, {
    value: '30',
    label: '30条/页'
  }, {
    value: '50',
    label: '50条/页'
  }, {
    value: '100',
    label: '100条/页'
  }
]
var initThData = [
  {
    name: '订单号',
    key: 'order_num',
    type: 'editFilter'
  },
  {
    name: '开单日期',
    key: 'create_order_time',
    type: 'dateFilter'
  },
  {
    name: '状态修改人',
    key: 'who_handle_name',
    type: 'editFilter'
  },
  {
    name: '发站',
    key: 'start_city_string',
    type: 'editFilter'
  },
  {
    name: '到站',
    key: 'end_city_string',
    type: 'editFilter'
  },
  {
    name: '托运人',
    key: 'consignor',
    type: 'editFilter'

  },
  {
    name: '托运人电话',
    key: 'consignor_mobile',
    type: 'editFilter'

  },
  {
    name: '收车人',
    key: 'consignee',
    type: 'editFilter'

  },
  {
    name: '收车人电话',
    key: 'consignee_mobile',
    type: 'editFilter'
  },
  {
    name: '货物名称',
    key: 'car_brand_name',
    type: 'editFilter'
  },
  {
    name: '识别码',
    key: 'heading_code',
    type: 'editFilter'
  },
  {
    name: '现付',
    key: 'pay_cash',
    isNeed: false
  },
  {
    name: '到付',
    key: 'freight_collect',
    isNeed: false
  },
  {
    name: '月结',
    key: 'monthly_statement',
    isNeed: false
  },
  {
    name: '付款方式',
    key: 'payment_method',
    type: 'selectFilter'
  },
  {
    name: '合计运费',
    key: 'total_cost',
    isNeed: false
  },
  {
    name: '经办人',
    key: 'operator',
    type: 'editFilter'
  },
  {
    name: '业务类别',
    key: 'type_of_business',
    type: 'selectFilter'
  },
  {
    name: '中转归属地',
    key: 'transfer_place',
    isNeed: false
  },
  {
    name: '运费付款方式',
    key: 'freight_settlement_method',
    isNeed: false
  },
  {
    name: '备注',
    key: 'remark',
    isNeed: false
  }
]
</script>
<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .page {
    position: relative;
    width: 100%;
    border: 1px solid red;
    display: flex;

    .bm-view {
      width: 80%;
      height: 600px;
    }

    .control-tab {
      width: 20%;
      font-size: j(20);
    }

    .car-item {
      height: j(40);
      border: 1px solid #f5f5f5;
      line-height: j(40);
      padding-left: j(10);
    }
  }

</style>
