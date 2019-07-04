<!--提送信息-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="亏损订单"/>
      <div class="">
        <el-button class="filter-item" type="primary" @click="checkLossOrderHandle">
          <i class="el-icon-edit-outline" ></i>
          批量确认亏损
        </el-button>
      </div>
    </div>
    <div class="totalTable-container">
      <div class="flex-between control">
        <div class="limit">
          当前显示:
          <el-select v-model="length" @change="changePageLimit" placeholder="请选择">
            <el-option v-for="item in option"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"/>
          </el-select>
        </div>
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>查询:</span>
            <el-input v-model="defParams.global_query"
                      placeholder="请写查询内容"
                      style="width: 200px;"
                      class="filter-item"
                      @keyup.enter.native="handleSearch"/>
            <el-button @click="handleSearch"
                       class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button class="filter-item" type="primary" @click="handleReset">
            <i class="el-icon-refresh"></i>
            重置
          </el-button>
          <el-button class="filter-item" type="primary" @click="exportList"
                     :loading="downloadLoading" icon="el-icon-download">
            导出
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
  </div>
</template>
<script>
import tableComponents from '../../components/Tables/dg-table2'
import { lossOrderList, checkLossOrder } from '../../../../api/business/businessOrder/lossOrder'
import waves from '@/directive/waves/index.js' // 水波纹指令
import comControl from './control.vue'//控制器

export default {
  components: { tableComponents },
  props: {},
  data() {
    return {
      global_query: '',
      defParams: defParams,
      option: option,
      tableData: [],
      columnData: [],
      info: '',// 总数据
      selectRow: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 160,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            this.$router.push(
              {
                name: 'businessAlterOrder',
                query: row.id
              }) // 有Bug
          },
          checkOrder:(row)=>{
            this.selectRow.push(row)
            this.checkLossOrderHandle()
          }
        }
      },
      filterParam: {},
      totalPage: 0,
      order_status: [],//下拉
      type_of_business: [],//下拉
      order_type: [],//下拉
      payment_method: [],//下拉
      isClear: 0,//重置
      downloadLoading: false
    }
  },
  computed: {
    pageData() {
      return {
        totalPageNum: this.totalPage,
        curPage: this.defParams.start
      }
    },
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
  },
  mounted() {},
  methods: {
    async getTableList(params) {
      let data = params ? params : this.defParams
      await lossOrderList(data).then((res) => {
        this.info = res.data
        // console.log('res.data', res)
        let { orders_data, payment_method, type_of_business, order_status, order_type, total_count, pagesize } = res.data
        this.tableData = orders_data
        this.totalPage = total_count
        this.defParams.pagesize = pagesize
        this.order_status = order_status
        this.type_of_business = type_of_business
        this.order_type = order_type
        this.payment_method = payment_method
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
        config.width = item.width ? item.width : '150'
        comConfig.filterKey = item.key
        comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.name === '订单状态') {
          comConfig.comData = this.order_status
        }
        if (item.name === '亏损审核状态') {
          comConfig.comData = [{ name: '已审核', value: 1 }, { name: '未审核', value: 0 }]
        }
        if (item.name === '审核状态') {
          comConfig.comData = [{ name: '已审核', value: 1 }, { name: '未审核', value: 0 }]
        }
        if (item.name === '订单分类') {
          comConfig.comData = this.order_type
        }
        if (item.name === '付款方式') {
          comConfig.comData = this.payment_method
        }
        if (item.name === '业务类型') {
          comConfig.comData = this.type_of_business
        }
        if (item.name === '回单') {
          comConfig.comData = [{ name: '有回单', value: 1 }, { name: '无回单', value: 0 }, { name: '已回单', value: 2 }]
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    // 重置
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
    checkLossOrderHandle() {
      if (this.selectRow.length >= 1) {
        let data = []
        this.selectRow.forEach((item, index) => {
          data.push(item.id)
        })
        let param = { order_id: data.join() }
        checkLossOrder(param).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.message
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择订单!'
        })
      }
      this.selectRow=[]
    },
    //* 搜索
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
    headerCss() {return 'font-size:16px; font-weight: 800;'},
    getSelect(row) {
      this.selectRow = row
      console.log('this.selectRow', this.selectRow)
    },
    pageChange(val) {
      this.defParams.currpage = val
      this.getTableList(this.defParams)
    },
    //改变显示数
    changePageLimit(val) {
      this.defParams.pagesize = val
      this.getTableList(this.defParams)
    },
    // 导出
    exportList() {
      // exportCustomer().then(() => {})
      return
      this.downloadLoading = true
      let keyVal = []
      let keyName = []
      this.initThData.forEach((item) => {
        keyVal.push(item.key)
        keyName.push(item.name)
      })
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = keyName
        const filterVal = keyVal
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '客户信息'
        })
        this.downloadLoading = false
      })
    }
  },
  directives: { waves }
}

var initThData = [
  {
    name: '订单号',
    key: 'order_num',
    type: 'editFilter'
  },
  {
    name: '运输批次号',
    key: 'depart_batch',
    type: 'editFilter'
  },
  {
    name: '订单状态',
    key: 'order_status',
    type: 'selectFilter'
  },
  {
    name: '亏损金额',
    key: 'amount_of_loss',
    type: 'editFilter'
  },
  {
    name: '亏损审核状态',
    key: 'loss_audit',
    type: 'selectFilter'
  },
  {
    name: '操作人',
    key: 'dispose_user',
    type: 'editFilter'
  },
  {
    name: '操作时间',
    key: 'dispose_time',
    type: 'dateFilter'
  },
  {
    name: '审核状态',
    key: 'is_audit',
    type: 'selectFilter'
  },
  {
    name: '订单分类',
    key: 'order_type',
    type: 'selectFilter'
  },
  {
    name: '发站',
    key: 'start_city_string',
    type: 'editFilter'
  },
  {
    name: '发站归属地',
    key: 'start_attribution',
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
    type: 'selectFilter'
  },
  {
    name: '收货人',
    key: 'consignee',
    type: 'editFilter'
  },
  {
    name: '收货人电话',
    key: 'consignee_mobile',
    type: 'editFilter'
  },
  {
    name: '货物名称',
    key: 'car_brand_name',
    type: 'selectFilter'
  },
  {
    name: '识别码',
    key: 'heading_code',
    type: 'dateFilter'
  },
  // {
  //   name: '垫付金额',
  //   key: 'advance',
  //   type: 'editFilter',
  //   isNeed: false,
  // },
  {
    name: '现付',
    key: 'pay_cash',
    type: 'dateFilter',
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
    name: '发货方回扣',
    key: 'discount',
    isNeed: false
  },
  {
    name: '付款方式',
    key: 'payment_method',
    type: 'selectFilter'
  },
  {
    name: '总运费',
    key: 'total_cost',
    type: 'editFilter'
  },
  {
    name: '经办人',
    key: 'operator',
    type: 'editFilter'
  },
  {
    name: '业务类型',
    key: 'type_of_business',
    type: 'selectFilter'
  },
  {
    name: '运车司机',
    key: 'convey_driver',
    type: 'editFilter'
  },
  {
    name: '运输所属公司',
    key: 'convey_company',
    type: 'editFilter'
  },
  {
    name: '司机电话',
    key: 'convey_driver_tel',
    type: 'editFilter'
  },
  {
    name: '提车司机',
    key: 'carry_car_name',
    type: 'editFilter'
  },
  {
    name: '送车司机',
    key: 'send_car_name',
    type: 'editFilter'
  },
  {
    name: '中转状态',
    key: 'is_transfer',
    type: 'editFilter'
  },
  {
    name: '开单日期',
    key: 'create_order_time',
    type: 'dateFilter'
  },
  // {
  //   name: '状态修改人',
  //   key: 'who_handle_name',
  //   type: 'editFilter',
  //   isNeed: false,
  // },
  {
    name: '审核人',
    key: 'audit_people',
    type: 'editFilter'
  },
  {
    name: '审核时间',
    key: 'audit_time',
    isNeed: false,
    type: 'dateFilter'
  },
  {
    name: '回单',
    key: 'has_receipt',
    type: 'selectFilter'
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
  order_num: '',// 订单号
  depart_batch: '',//多个发车批次号的集合
  order_status: '',//订单状态
  amount_of_loss: '',//亏损金额
  loss_audit: '',//	亏损审核状态 0.未审核 1.已审核
  dispose_user: '',//操作人
  dispose_time_start: '',//操作时间开始
  dispose_time_end: '',//	操作时间结束
  is_audit: '',//审核状态 0.未审核 1.已审核
  order_type: '',//订单类型
  start_city_string: '',// 发站
  start_attribution: '',// 发站归属地
  end_city_string: '',// 到站
  end_attribution: '',// 到站归属地
  consignor: '',//托运人
  consignor_mobile: '',//托运人电话
  consignee: '',//收货人
  consignee_mobile: '',//收货人电话
  car_brand_name: '',// 货物信息
  heading_code: '',//车架号
  payment_method: '',//付款方式
  operator: '',//经办人
  type_of_business: '',//业务类型
  convey_driver: '',//运车司机
  convey_company: '',//司机所属公司
  convey_driver_tel: '',//司机电话
  carry_car_name: '',//提车司机
  send_car_name: '',//送车司机
  is_transfer: '',// 中转状态
  create_order_time_start: '',// 开单日期开始
  create_order_time_end: '',// 开单日期结束
  who_handle_name: '',// 状态修改人 // 废弃
  audit_people: '',// 审核人
  audit_time_start: '',// 审核时间开始值
  audit_time_end: '',//审核时间结束值
  has_receipt: ''//回单 0’无回单’,1’有回单’, 2’已回单’
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
