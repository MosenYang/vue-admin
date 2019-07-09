<!--运输明细表-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="运输明细表"/>
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
            <el-button @click="handleSearch" class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button class="filter-item" type="primary">
            <i class="el-icon-refresh"></i>
            重置
          </el-button>
          <el-button class="filter-item"
                     type="primary">
            <i class="el-icon-edit-outline" style=""></i>
            审核
          </el-button>
          <el-button class="filter-item"
                     type="primary">
            <i class="el-icon-news" style=""></i>
            确认运费
          </el-button>
          <el-button class="filter-item"
                     type="primary">
            <i class="el-icon-upload" style=""></i>
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
import waves from '@/directive/waves/index.js' // 水波纹指令
import {
  transInfoList,
  addTransportPrice,
  unload,
  againCheck,
  transferType,
  transferStatus
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
      isClear: 0,
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 140,
        fixed: true,
        // component: comControl,
        handlers: {
          editOrder: (row) => {
            this.$router.push({ path: '/addContractor', query: row })
          },
          deleteOrder: this.deleteOrder
        }
      },
      filterParam: {},
      total: 0
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
  created() {
    this.getTableList()
  },
  mounted() {},
  methods: {
    async getTableList(params) {
      let data = params ? params : this.defParams
      await transInfoList(data).then((res) => {
        this.info = res.data
        console.log('res.data', res)
        let {
          info,
          attribution,
          freight_settlement_method,
          order_status,
          order_type,
          payment_method,
          type_of_business,
          total_count, pagesize
        } = res.data
        this.tableData = info
        this.totalPage = total_count
        this.defParams.pagesize = pagesize
        this.order_status = order_status
        this.type_of_business = type_of_business
        this.order_type = order_type
        this.payment_method = payment_method
        this.attribution = attribution
        this.freight_settlement_method = freight_settlement_method
      })
    },
    callBack(data) {
      console.log('回调', data)
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
        config.paramKey = comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.name === '订单状态') {
          comConfig.comData = this.order_status
        }
        if (item.name === '发展归属地' || '到站归属地') {
          comConfig.comData = this.attribution
        }

        if (item.name === '订单分类') {
          comConfig.comData = this.order_type
        }
        //0
        if (item.name === '付款方式' && item.key !== 'payment_method') {
          config.width = 180
          config.tdComponent = tdComonent
          config.tdConfig = {
            callback(data) {console.log('', data)},
            comData: this.freight_settlement_method,
            comType: 'select'// 'select','edit'
          }
        } else {
          comConfig.comData = this.payment_method
        }
        1
        if (item.name === '调度填写运费' || item.name === '财务填写运费' || item.name === '车队填写运费') {
          config.width = 180
          config.tdComponent = tdComonent
          config.tdConfig = {
            comData: null,
            comType: 'edit'// 'select','edit'
          }
        }

        if (item.name === '业务类型') {
          comConfig.comData = this.type_of_business
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
    name: '订单状态',
    key: 'order_status',
    type: 'selectFilter'

  },
  {
    name: '发站',
    key: 'start_city_string',
    type: 'editFilter'
  },
  {
    name: '发展归属地',
    key: 'start_attribution',
    type: 'selectFilter'

  },
  {
    name: '到站',
    key: 'end_city_string',
    type: 'editFilter'
  },
  {
    name: '到站归属地',
    key: 'end_attribution',
    type: 'selectFilter'
  },
  {
    name: '托运人',
    key: 'consignor',
    type: 'editFilter'
  },
  {
    name: '货物名称',
    key: 'car_brand_name',
    type: 'editFilter'
  },
  {
    name: '识别码',
    key: '',
    type: 'editFilter'
  },
  {
    name: '单价',
    key: 'price',
    type: 'editFilter'
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
    name: '回单',
    key: 'has_receipt',
    type: 'selectFilter'
  },
  {
    name: '中转状态',
    key: 'is_transfer',
    type: 'selectFilter'
  },
  {
    name: '中转归属地',
    key: 'transfer_place',
    isNeed: false
  },
  {
    name: '结算方式',
    key: 'freight_settlement_method',
    isNeed: false
  },
  {
    name: '运费',
    key: 'freight',
    isNeed: false
  },
  {
    name: '运费修改人',
    key: 'change_freight_username',
    type: 'editFilter'
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
  query: '',
  currpage: 1,
  pagesize: 10,
  waybill_id: '',
  order_num: '',
  order_status: '',
  start_city_string: '',
  start_attribution: '',
  end_city_string: '',
  end_attribution: '',
  consignor: '',
  car_brand_name: '',
  heading_code: '',
  operator: '',
  type_of_business: '',
  has_receipt: '',
  is_transfer: ''
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
