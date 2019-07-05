<!--业务提成-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="业务提成"/>
      <div class="">
        <!--        <el-button class="filter-item" type="primary">-->
        <!--          <i class="el-icon-edit-outline" ></i>-->
        <!--        </el-button>-->
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
          <el-button class="filter-item" @click="exportHandle"
                     type="primary">
            <i class="el-icon-upload"></i>
            导出
          </el-button>
          <el-button class="filter-item" @click="checkHandle"
                     type="primary">
            <i class="el-icon-edit-outline"></i>
            批量审核
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
import {
  pushMoneyList,
  checkPushMoney,
  exportPushMoney,
  alterPushMoney
} from '../../../../api/business/businessOrder/pushMoney'
import waves from '@/directive/waves/index.js' // 水波纹指令
import comControl from './control.vue'//控制器
import tdComonent from './tdComonent.vue'//表格

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
        width: 80,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            console.log('row', row.id)
            this.$router.push(
              {
                name: 'businessAlterOrder',
                query: row.id
              }) // 有Bug
          }
        }
      },
      filterParam: {},
      totalPage: 0,
      order_status: [],//下拉
      type_of_business: [],//下拉
      order_type: [],//下拉
      payment_method: [],//下拉
      attribution: [],
      freight_settlement_method: [],
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
      await pushMoneyList(data).then((res) => {
        this.info = res.data
        console.log('页面.data', res)
        let {
          info,
          attribution,
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
        if (item.name === '发展归属地' || item.name === '到站归属地') {
          comConfig.comData = this.attribution
        }
        if (item.name === '审核状态') {
          comConfig.comData = [
            { name: '已审核', value: 1 },
            { name: '未审核', value: 0 }]
        }
        if (item.name === '业务类型') {
          comConfig.comData = this.type_of_business
        }
        //1
        if (item.name === '系统单价') {
          config.width = 180
          config.tdComponent = tdComonent
          config.tdConfig = {
            comData: null,
            comType: 'edit'// 'select','edit'
          }
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
    //导出
    exportHandle() {
      let data=[]
      if (this.selectRow.length === 0) {
        return this.$message({
          type: 'error',
          message: '请先选择表!'
        })
      }
      else{
        this.selectRow.forEach((item)=>{
          data.push(item.id)
        })
        exportPushMoney({ order_id:data.join()}).then((res) => {
          let blob = res
          // blob.type = 'application/octet-stream'
          var filename = '模板.xlsx'
          var a = document.createElement('a')
          var url = URL.createObjectURL(blob)//创键临时url对象
          a.href = url
          a.download = filename
          a.click()
          window.URL.revokeObjectURL(url)
        })
      }
    },
    //审核
    checkHandle() {
      let data=[]
      if (this.selectRow.length === 0) {
        return this.$message({
          type: 'error',
          message: '请先选择表!'
        })
      }
      else{
        this.selectRow.forEach((item)=>{
          data.push(item.id)
        })
        checkPushMoney({ order_id:data.join(),module_id:3}).then((res)=>{
          if(res.code==200){
            return this.$message({
              type: 'success',
              message: '审核成功!'
            })
          }
        })
      }
    },
    getFilter(val) {
      if (val.create_order_time && val.create_order_time !== '') {//开单日期
        this.defParams.create_order_time_start = val.create_order_time[0]
        this.defParams.create_order_time_end = val.create_order_time[1]
      } else {
        this.defParams.audit_time_start = this.defParams.audit_time_end = ''
      }
      if (val.audit_time && val.audit_time !== '') {// 审核时间
        this.defParams.audit_time_start = val.audit_time[0]
        this.defParams.create_order_time_end = val.audit_time[1]
      } else {
        this.defParams.audit_time_start = this.defParams.audit_time_end = ''
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
      // this.selectRow = []
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
    name: '审核状态',
    key: 'is_audit',
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
    name: '系统单价',
    key: 'system_price',
    isNeed: false
  },
  {
    name: '接车单价',
    key: 'price',
    isNeed: false
  },
  {
    name: '多出提成',
    key: 'commission',
    isNeed: false
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
    name: '开单日期',
    key: 'create_order_time',
    type: 'dateFilter'
  },
  {
    name: '审核人',
    key: 'audit_people',
    type: 'editFilter'
  },
  {
    name: '审核时间',
    key: 'audit_time',
    type: 'dateFilter'
  }
]
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
  },
  {
    value: '300',
    label: '300条/页'
  },
  {
    value: '500',
    label: '500条/页'
  }
]
var defParams = {
  global_query: '',
  pagesize: 10,
  currpage: 1,
  order_num: '',// 订单号
  order_status: '',//订单状态
  is_audit: '',// 审核状态
  start_city_string: '',// 发站
  start_attribution: '',// 发站归属地
  end_city_string: '',// 到站
  end_attribution: '',// 到站归属地
  car_brand_name: '',//货物信息
  heading_code: '',//识别码
  operator: '',//经办人
  create_order_time_start: '',// 开始开单日期
  create_order_time_end: '',//结束开单日期
  audit_people: '',//审核人
  audit_time_start: '',//审核时间开始值
  audit_time_end: ''//审核时间结束
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

