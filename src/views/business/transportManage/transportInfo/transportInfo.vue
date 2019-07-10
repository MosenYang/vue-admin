<!--运输信息-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="运输信息"/>
      <div class=""></div>
    </div>
    <div class="totalTable-container">
      <div class="flex-between control">
        <div class="limit">
          当前显示:
          <el-select v-model="length"
                     @change="changePageLimit"
                     placeholder="请选择">
            <el-option v-for="item in option"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"/>
          </el-select>
        </div>
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>查询:</span>
            <el-input v-model="defParams.query"
                      placeholder="请写查询内容"
                      style="width: 200px;"
                      class="filter-item"
                      @keyup.enter.native="handleSearch"/>
            <el-button v-waves @click="handleSearch" class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button v-waves class="filter-item" type="primary">
            <i class="el-icon-refresh"></i>
            重置
          </el-button>
        </div>
      </div>
    </div>
    <div>
      <table-components :table-data="tableData" :selection="true" :pagination="true"
                        :action-config="actionConfig"
                        :isClear="isClear"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        @select-change="getSelect"
                        :headerCellStyle="headerCss"
                        @page-change="pageChange"/>
    </div>
    <!--补装车-->
    <el-dialog title="补装车" :visible.sync="trucking" width="70%" center>
      <div class="totalTable-container">
        <div class="flex-between control">
          <div class="limit">
            当前显示:
            <el-select v-model="truckLength"
                       @change="changeTruckPageLimit"
                       placeholder="请选择">
              <el-option v-for="item in option"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </div>
          <div class="filters-btns">
            <!--            <div class="inquire-wrap">-->
            <!--              <span>查询:</span>-->
            <!--              <el-input v-model="defParams.query"-->
            <!--                        placeholder="请写查询内容"-->
            <!--                        style="width: 200px;"-->
            <!--                        class="filter-item"-->
            <!--                        @keyup.enter.native="handleSearch"/>-->
            <!--              <el-button v-waves @click="handleSearch" class="filter-item" type="primary" icon="el-icon-search">-->
            <!--                查询-->
            <!--              </el-button>-->
            <!--            </div>-->
            <el-button v-waves class="filter-item" type="primary" @click="resetTruck">
              <i class="el-icon-refresh"></i>
              重置
            </el-button>
            <el-button v-waves class="filter-item" type="primary" @click="truckCar">
              <i class="el-icon-refresh"></i>
              补装车
            </el-button>
          </div>
        </div>
      </div>
      <!--表格-->
      <table-components :table-data="truckDataList" :selection="true" :pagination="true"
                        :isClear="isClear"
                        :column-config="truckColumnData"
                        :page-config="truckPage"
                        @filter-change="filterTruck"
                        @select-change="selectTruck"
                        :headerCellStyle="headerCss"
                        @page-change="TruckPageChange"/>
    </el-dialog>
    <!-- 添加在途信息 -->
    <el-dialog title="添加在途信息" :visible.sync="addLoading" width="30%" center>
      <el-form label-position="left">
        <el-form-item>
          <el-input v-model="addRoadInfo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLoading = false">取消</el-button>
        <el-button type="primary" @click="addRoadHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加发车信息 -->
    <el-dialog title="添加发车信息" :visible.sync="carStart" width="30%" center>
      <el-form label-position="left" label-width="70px" ref="form" :model="temp">
        <el-form-item label="发车日期">
          <el-date-picker v-model="temp.date" type="date" placeholder="选择日期" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发车站">
          <el-input v-model="temp.start_address"></el-input>
        </el-form-item>
        <el-form-item label="到达地">
          <el-input v-model="temp.end_address"></el-input>
        </el-form-item>
        <el-form-item label="途径地">
          <el-input v-model="temp.pathway"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="carStart = false">取消</el-button>
        <el-button type="primary" @click="addCarStartHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableComponents from '../../components/Tables/dg-table2'
import control from './control'
import waves from '@/directive/waves/index.js' // 水波纹指令
import tdComponent from '../../../../components/Tables/tdComonent'
import { parseTime } from '@/utils'
import {
  transportInfoList,
  transportOnway,
  transportAdd,
  transportLoading,
  transfer,
  transferExport
} from '../../../../api/business/transportMangage/transportInfo'

export default {
  components: { tableComponents },
  props: {},
  data() {
    return {
      query: '',
      defParams: defParams,
      option: option,
      tableData: [],
      columnData: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 350,
        fixed: true,
        component: control,
        handlers: {
          changeTransport: this.changeTransport,
          addTransportAar: this.addTransportAar,
          createFile(row) {},
          uploadFile: this.uploadFile
        }
      },
      filterParam: {},//删选条件
      totalPage: 0,
      isClear: 0,
      car_status: [],
      trucking: false,
      truckData: [],
      truckDataList: [],
      truckColumnData: [],
      defTruckParams: defTruckParams,
      filterTruckParam: {},
      payment_method: [],
      freight_settlement_method: [],
      type_of_business: [],
      addLoading: false,
      addRoadInfo: '',
      rowId: '',
      temp: {
        pc_id: '',
        date: '',
        start_address: '',
        end_address: '',
        pathway: ''
      },
      carStart: false
    }
  }
  ,
  computed: {
    truckPage() {
      return {
        totalPageNum: this.truckData.total_count,
        curPage: this.defTruckParams.currpage
      }
    },
    truckLength: {
      get() {
        if (this.defTruckParams.pagesize) return this.defTruckParams.pagesize + '条/页'
      },
      set(val) {
        this.defTruckParams.pagesize = val
      }
    },
    pageData() {
      return {
        totalPageNum: this.totalPage,
        curPage: this.defParams.currpage
      }
    }
    ,
    length: {
      get() {
        if (this.defParams.pagesize) return this.defParams.pagesize + '条/页'
      },
      set(val) {
        this.defParams.pagesize = val
      }
    }
  },
  watch: {},
  async created() {
    await this.getTableList()
    this.mapTableTh()
  }
  ,
  mounted() {
  },
  methods: {
    async getTableList(params) {
      let data = params ? params : this.defParams
      await transportInfoList(data).then((res) => {
        this.info = res.data
        console.log('res.data', res.data.data)
        let {
          data, car_status,
          total_count, pagesize
        } = res.data
        this.tableData = data
        this.totalPage = total_count
        this.defParams.pagesize = pagesize
        this.car_status = car_status
      })
    },
    mapTableTh() {
      console.log(initThData.length, '订单总表表格列数')
      initThData.forEach((item, index) => {
        let config = { ...tableConfig }
        let comConfig = { ...tableConfig.filterConfig }
        config.prop = item.key // 数据字段
        config.thIndex = index
        config.isNeed = item.isNeed === false ? false : true
        config.label = comConfig.label = item.name
        config.type = comConfig.type = item.type
        config.width = item.width ? item.width : '130'
        comConfig.filterKey = item.key
        config.paramKey = comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.key === 'now_status') {
          comConfig.comData = this.car_status
        }
        if (item.name === '是否有中转订单' || item.name === '是否更新在途') {
          comConfig.comData = [{ name: '是', value: 1 }, { name: '否', value: 0 }]
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    changePageLimit(val) {
      this.getTableList()
    },
    handleReset() {
      let i = Math.floor(Math.random() * 10 + 1)
      this.isClear = i
      for (let key in this.filterParam) {
        this.filterParam[key] = ''
      }
      console.log('重置', this.filterParam)
      let param = Object.assign(this.defParams, this.filterParam, { currpage: 1 })
      this.getTableList(param)
    },
    handleSearch() {
      if (this.defParams.global_query) {
        this.defParams.currpage = 1
        this.getTableList(this.defParams)
      } else {
        this.$message({
          showClose: true,
          message: '请输入查询内容',
          type: 'warning'
        })
      }
    },
    getFilter(val) {
      if (val.dispose_time && val.dispose_time !== '') {//操作时间
        this.defParams.dispose_time_start = val.dispose_time[0]
        this.defParams.dispose_time_end = val.dispose_time[1]
      } else {
        this.defParams.audit_time_start = ''
        this.defParams.audit_time_end = ''
      }
      if (val.create_order_time && val.create_order_time !== '') {// 开单日期
        this.defParams.create_order_time_start = val.create_order_time[0]
        this.defParams.create_order_time_end = val.create_order_time[1]
      } else {
        this.defParams.create_order_time_start = ''
        this.defParams.create_order_time_end = ''
      }
      let param = Object.assign(this.defParams, val, { currpage: 1 })
      this.filterParam = { ...val }
      this.getTableList(param)
      console.log(val, '当前参数')
      console.log(param, '请求参数')
    },
    headerCss() {
      return 'font-size:16px; font-weight: 800;'
    },
    getSelect(row) {
      this.selectRow = row
      console.log('this.selectRow', this.selectRow)
    },
    pageChange(val) {
      this.defParams.currpage = val
      this.getTableList(this.defParams)
    },
    uploadFile() {},
    changeTransport(row, status) {
      console.log(row, status, '9090')
      this.rowId = row.waybill_id
      if (status === '添加在途') {
        this.addLoading = true
      } else {
        this.carStart = true
      }
    },
    addCarStartHandle() {
      // 文档有一个参数没写,改一下就好
      this.temp.pc_id = this.rowId
      this.temp.date = parseTime(this.temp.date)
      console.log(this.temp, '参数')
      transportAdd(this.temp).then((res) => {
        if (res.code === 200) {
          this.carStart = false
        }
      })
    },
    addTransportAar(row) {// 补装车
      transportLoading().then((res) => {
        console.log('补装车.data', res.data)
        this.truckData = res.data
        let { freight_settlement_method, orders_data, pagesize, payment_method, total_count, type_of_business }
          = res.data
        this.trucking = true
        this.truckDataList = orders_data
        this.defTruckParams.pagesize = pagesize
        this.payment_method = payment_method
        this.type_of_business = type_of_business
        this.freight_settlement_method = freight_settlement_method

        this.mapTuckTh()
      })
    },
    mapTuckTh() {
      truckThData.forEach((item, index) => {
        let config = { ...tableConfig }
        let comConfig = { ...tableConfig.filterConfig }
        config.prop = item.key // 数据字段
        config.thIndex = index
        config.isNeed = item.isNeed ? config.isNeed : false
        config.label = comConfig.label = item.name
        config.type = comConfig.type = item.type
        config.width = item.width ? item.width : '140'
        comConfig.filterKey = item.key
        comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.name === '付款方式') {
          comConfig.comData = this.payment_method
        }
        if (item.name === '业务类别') {
          comConfig.comData = this.type_of_business
        }
        if (item.name === '中转归属地') {// 组件的下拉数据暂时没
          config.width = 180
          config.tdComponent = tdComponent
          config.tdConfig = {
            comData: this.freight_settlement_method,
            comType: 'select',
            callback: this.callback
          }
        }
        if (item.name === '运费付款方式') {
          config.width = 180
          config.tdComponent = tdComponent
          config.tdConfig = {
            comData: this.freight_settlement_method,
            comType: 'select',
            callback: this.callback
          }
        }
        if (item.name === '备注') {
          config.width = 180
          config.tdComponent = tdComponent
          config.tdConfig = {
            comData: null,
            comType: 'edit'// 'select','edit'
          }
        }
        config.filterConfig = comConfig
        this.truckColumnData.push(config)
      })
    },
    callback(val) {
      console.log(val, '详情00000')
    },
    onTruckHandle() {
      if (this.selectRow.length >= 1) {
        let out = this.selectRow.every((val, i, a) => {
          return val.order_status === '已入库'
        })
        if (out) {
          this.trucking = true
          let params = { ...this.defTruckParams }
          moreLoading(params).then((res) => {
            if (res.code === 200) {
              this.truckData = res.data
              console.log('res.data', res.data.data)
            }
            this.mapTuckTh()
          })
        } else {
          this.$message({
            showClose: true,
            message: '订单车辆必须是已入库状态!!'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '请选择订单'
        })
      }
    },
    TruckTableList(params) {
      let data = params ? params : { ...this.defTruckParams }
      moreLoading(data).then((res) => {
        if (res.code === 200) {
          this.truckData = res.data
          console.log('res.data', res.data.data)
        }
      })
    },
    TruckPageChange(val) {
      let param = Object.assign(this.defTruckParams, { currpage: val })
      this.TruckTableList(param)
    },
    selectTruck(val) {
      this.selectTruckRow = val
    },
    filterTruck(val) {
      this.filterTruckParam = { ...val }
      let param = Object.assign(this.defTruckParams, val, { currpage: 1 })
      this.TruckTableList(param)
      console.log(val, '筛选')
    },
    resetTruck() {
      let i = Math.floor(Math.random() * 10 + 1)
      this.isClear = i
      for (let key in this.filterTruckParam) {
        this.filterTruckParam[key] = ''
      }
      let param = Object.assign(this.defTruckParams, this.filterTruckParam, { currpage: 1 })
      this.TruckTableList(param)
    },
    changeTruckPageLimit() {},
    addRoadHandle() {
      let params = {
        waybill_id: this.rowId,
        content: this.addRoadInfo
      }
      if (!this.addRoadInfo) {
        return this.$message({
          type: 'error',
          message: '请输入内容!'
        })
      }
      transportOnway(params).then((res) => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.addLoading = false
      })
    },
    truckCar() {
      if (this.selectTruckRow.length >= 1) {
        //没有接口
        return
      }
      return this.$message({
        type: 'warning',
        message: '请选择车辆!'
      })
    }
  },
  directives: {
    waves
  }
}

var initThData = [
  {
    name: '批次号',
    key: 'waybill_number',
    type: 'editFilter'
  },
  {
    name: '车牌号',
    key: 'license_plate_number',
    type: 'editFilter'
  },
  {
    name: '所属公司',
    key: 'company',
    type: 'editFilter'
  },
  {
    name: '司机姓名',
    key: 'driver_name',
    type: 'editFilter'
  },
  {
    name: '司机电话',
    key: 'mobile',
    type: 'selectFilter'
  },
  {
    name: '车辆状态',
    key: 'now_status',
    type: 'selectFilter'
  },
  {
    name: '是否有中转订单',
    key: 'has_transfer',
    type: 'selectFilter',
    width: '190'
  },
  {
    name: '是否更新在途',
    key: 'on_the_way_time',
    type: 'selectFilter',
    width: '170'
  },
  {
    name: '发站',
    key: 'start_address',
    type: 'editFilter'
  },
  {
    name: '途径',
    key: 'pathway',
    type: 'editFilter'
  },
  {
    name: '到站',
    key: 'end_address',
    type: 'editFilter'
  },
  {
    name: '发车时间',
    key: 'start_time',
    isNeed: false,
    width: 180
  },
  {
    name: '到达时间',
    key: 'end_time',
    isNeed: false,
    width: 180
  },
  {
    name: '总单数',
    key: 'order_num',
    isNeed: false
  },
  {
    name: '总垫付款',
    key: 'total_advance',
    isNeed: false
  },
  {
    name: '总运费',
    key: 'total_cost',
    isNeed: false
  },
  {
    name: '备注',
    key: 'remark',
    isNeed: false
  }
]
var tableConfig = {
  prop: '', // 参数字段
  label: '', // 名字
  type: '', // 类型当前表头交互类型
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
var defParams = {
  global_query: '',
  pagesize: 10,
  currpage: 1,
  waybill_number: '',//?
  license_plate_number: '',//end_address
  company: '',// 所属公司
  driver_name: '',//司机姓名
  mobile: '',//司机电话
  now_status: '',//车辆状态
  has_transfer: '',//是否有中转订单
  on_the_way_time: '',//是否更新在途
  start_address: '',//发站
  pathway: '',//途径
  end_address: ''//途径
}
var truckThData = [
  {
    name: '订单号',
    key: 'order_num',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '开单日期',
    key: 'create_order_time',
    type: 'dateFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '状态修改人',
    key: 'who_handle_name',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '发站',
    key: 'start_city_string',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '到站',
    key: 'end_city_string',
    paramKey: null,
    isNeed: true
  },
  {
    name: '托运人',
    key: 'consignor',
    paramKey: null,
    isNeed: true
  },
  {
    name: '托运人电话',
    key: 'consignor_mobile',
    paramKey: null,
    type: 'editFilter',
    isNeed: true
  },
  {
    name: '收车人',
    key: 'consignee',
    paramKey: null,
    type: 'editFilter'

  },
  {
    name: '收车人电话',
    key: 'consignee_mobile',
    paramKey: null,
    type: 'editFilter',
    isNeed: true
  },
  {
    name: '货物名称',
    key: 'car_brand_name',
    paramKey: null,
    type: 'editFilter',
    isNeed: true
  },
  {
    name: '识别码',
    key: 'heading_code',
    paramKey: null,
    type: 'editFilter',
    isNeed: true
  },
  {
    name: '现付',
    key: 'pay_cash',
    paramKey: null,
    isNeed: false
  },
  {
    name: '到付',
    key: 'freight_collect',
    paramKey: null,
    type: 'editFilter',
    isNeed: false
  },
  {
    name: '月结',
    key: 'monthly_statement',
    paramKey: null
  },
  {
    name: '付款方式',
    key: 'payment_method',
    paramKey: null,
    type: 'selectFilter',
    isNeed: true
  },
  {
    name: '合计运费',
    key: 'total_cost',
    paramKey: null,
    isNeed: false
  },
  {
    name: '经办人',
    key: 'operator',
    paramKey: null,
    type: 'editFilter',
    isNeed: true
  },
  {
    name: '业务类别',
    key: 'type_of_business',
    paramKey: null,
    type: 'selectFilter',
    isNeed: true
  },
  {
    name: '中转归属地',
    key: 'transfer_place',
    paramKey: null
  },
  {
    name: '运费付款方式',
    key: 'freight_settlement_method',
    paramKey: null
  },
  {
    name: '备注',
    key: 'remark',
    paramKey: null,
    isNeed: false
  }
]
var defTruckParams = {
  pagesize: 10,
  currpage: 1,
  create_order_time_end: '',
  create_order_time_start: '',
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
  @import "src/styles/mixin.scss";

  .page-title {
    font-size: j(30);
    padding: j(10) j(20);
    margin: j(5) 0;
    box-shadow: 0 2px 10px #f2f2f2;
    font-weight: 400;

    .el-button {
      @extend %cyan-btn
    }
  }

  .totalTable-container {
    padding: 0 j(20);

    .el-button {
      @extend %cyan-btn
    }

    .control {
      font-size: j(20);

      .limit {
        font-size: j(12);
        padding-left: j(15);
      }

      .filters-btns {
        @extend %end;
        color: #262626;
        padding: j(15) 0;
        font-size: j(16);

        .inquire-wrap {
          margin-right: j(10);
        }
      }
    }

  }

</style>
