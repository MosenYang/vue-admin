<!--装车排版-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="装车排版"/>
      <div class="">
        <el-button v-waves type="primary">
          选择路线
        </el-button>
        <el-button v-waves type="primary">
          添加路线
        </el-button>
        <el-button v-waves type="primary">
          保存路线
        </el-button>
      </div>
    </div>
    <div class="page-addressLine">
      <div class="page-address flex">
        <div class="icon-article" v-for="(item,i) in 5">
          <div class="icon">
            <div class="icon-close">
              <i class="el-icon-circle-close" style="color: red"></i>
            </div>
            <div class="icon-pic flex-center">
              <i class="el-icon-location" style="color: #b3d3c2;"></i>
            </div>
            <div class="icon-content">
              <div>上海<span>(35)</span></div>
              <div>天津<span>(35)</span></div>
              <div>
                <i class="el-icon-circle-plus-outline" style="color: blue"></i>
              </div>
            </div>
          </div>
          <div class="icon-line flex-center" v-if="i!==4">
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <table-components :table-data="tableData" :selection="false" :pagination="false"
                        :barShow="false"
                        :action-config="actionConfig"
                        :isClear="isClear"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        @select-change="getSelect"
                        :headerCellStyle="headerCss"
                        @page-change="pageChange"/>
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
            <el-button @click="handleSearch"
                       class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search">
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
    <dialog>

    </dialog>
  </div>
</template>
<script>
import tableComponents from '../../components/Tables/dg-table2'
import waves from '@/directive/waves/index.js' // 水波纹指令
import tdComponent from '../../../../components/Tables/tdComonent'
import comControl from './control'
import {
  truck, add, transportLineList,
  changeMiddle, changePayMethod, alterFreight, deleteLine, editLine
} from '../../../../api/business/transportMangage/loadingArrange'

export default {
  components: { tableComponents },
  props: {},
  data() {
    return {
      query: '',
      defParams: defParams,
      option: option,
      info: [],
      tableData: [],
      columnData: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 100,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            this.$router.push({ path: '/addContractor', query: row })
          },
          deleteOrder: this.deleteOrder
        }
      },
      filterParam: {},
      totalPage: 0,
      isClear: 0,
      type_of_business: [],
      freight_settlement_method: [],
      transfer_place: []
    }
  },
  computed: {
    pageData() {
      return {
        totalPageNum: this.totalPage,
        curPage: this.defParams.curPage
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
      await truck(data).then((res) => {
        this.info = res.data
        console.log('liebiaodata', res.data)
        let {
          info,
          freight_settlement_method,
          transfer_place, type_of_business,
          total_count, pagesize
        } = res.data
        this.tableData = info
        this.totalPage = total_count
        this.defParams.pagesize = pagesize
        this.transfer_place = transfer_place
        this.type_of_business = type_of_business
        this.freight_settlement_method = freight_settlement_method
      })
    },
    mapTableTh() {
      console.log(initThData2.length, '订单总表表格列数')
      initThData2.forEach((item, index) => {
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
        if (item.name === '业务类别') {
          comConfig.comData = this.type_of_business
        }
        //select
        if (item.name === '中转地' || item.name === '运费结算方式') {
          config.width = 180
          config.tdComponent = tdComponent
          let data
          if (item.name === '中转地') data = this.transfer_place
          if (item.name === '运费结算方式') data = this.freight_settlement_method
          config.tdConfig = {
            comData: data,
            comType: 'select',
            callback: this.callback
          }
        }
        //edit
        if (item.name === '运费') {
          config.width = 180
          config.tdComponent = tdComponent
          config.tdConfig = {
            comData: null,
            comType: 'edit',
            callback: this.callback
          }
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    callback(params) {
      console.log('', params)
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
      if (this.defParams.query) {
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
    changePageLimit(val) {
      this.defParams.pagesize = val
      this.getTableList(this.defParams)
    }
    // 合同
  },
  directives: { waves }
}
var initThData1 = [
  {
    name: '发车批次',
    key: ''
  },
  {
    name: '状态',
    key: ''
  },
  {
    name: '车牌号',
    key: ''
  },
  {
    name: '所属公司',
    key: ''
  },
  {
    name: '司机姓名',
    key: ''
  },
  {
    name: '司机电话',
    key: ''
  },
  {
    name: '发站',
    key: ''
  },
  {
    name: '到站',
    key: ''
  },
  {
    name: '装车数',
    key: ''
  },
  {
    name: '总单数',
    key: ''
  },
  {
    name: '备注',
    key: ''
  }
]
var initThData2 = [
  {
    name: '订单号',
    key: 'order_num',
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
    name: '单价',
    key: 'price',
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
    name: '中转地',
    key: 'transfer_place',
    isNeed: false
  },
  {
    name: '运费结算方式',
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
    type: 'editFilter',
    isNeed: false
  },
  {
    name: '运费修改时间',
    key: 'freight_audit_time',
    type: 'editFilter',
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
  query: '',// 搜索字段
  start: 1,
  length: 10,// 条数
  order_num: '',
  start_city_string: '',
  end_city_string: '',
  consignor: '',
  car_brand_name: '',
  heading_code: '',
  operator: '',
  type_of_business: '',
  business_scope: '',
  freight_settlement_method: '',
  change_freight_username: '',
  freight_audit_time_start: '',
  freight_audit_time_end: ''
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

  .page-addressLine {
    font-size: j(16);
    padding: j(5);
    background: #f9f9f9;

    .page-address {
      .icon-article {
        display: flex;
        flex: 1;

        .icon {
          width: j(130);
          position: relative;

          .icon-close {
            position: absolute;
            right: 0;
            top: j(-10);
            font-size: j(30);
          }

          .icon-pic {
            padding: j(20) 0 0;

            i {
              font-size: j(60);
            }
          }

          .icon-content {
            div {
              font-size: j(16);
              text-align: center;
            }
          }
        }

        .icon-line {
          width: 100%;
          padding: 0 j(10);

          .line {
            height: j(2);
            background: #b3d3c2;
            width: 100%;
          }
        }
      }
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
