<template>
  <div class="page">
    <div class="page-title flex-between">
      <span>回单信息</span>
      <el-button type="primary" icon="el-icon-plus" @click="outerVisible = true">
        添加回单信息
      </el-button>
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
            <el-input v-model="defParams.query" placeholder="请写查询内容" style="width: 200px;"
                      class="filter-item" @keyup.enter.native="handleSearch"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button @click="handleReset" class="filter-item" type="primary"
                     icon="el-icon-search">
            重置
          </el-button>
          <el-button class="filter-item" type="primary" @click="exportList"
                     :loading="downloadLoading" icon="el-icon-download">
            导出
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-wrap">
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

    <!--添加新回单-->
    <el-dialog title="添加新回单" :visible.sync="outerVisible">
      <el-form :model="temp" label-position="top" ref="ruleForm" label-width="100px" :rules="rules">
        <el-row>
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="预计到达时间" prop="username">
              <el-input v-model="temp.predict_time"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="实际到达时间" prop="mobile">
              <el-input v-model="temp.fact_time"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="收件单号/来源" prop="username">
              <el-input v-model="temp.courier_number"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="寄件单号" prop="mobile">
              <el-input v-model="temp.mobile"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="收件人" prop="username">
              <el-input v-model="temp.recipients"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="收件人电话" prop="mobile">
              <el-input v-model="temp.recipients_tel"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="24" :md="24" :sm="24">
            <el-form-item label="备注">
              <el-input v-model="temp.receipt_remark"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--end-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">返回</el-button>
        <el-button type="primary" @click="outerVisible = false">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TableComponents from '../../components/Tables/dg-table2'
import {
  addFeedback,
  getFeedbackList,
  editFeedbackInfo,
  FeedbackInfo
} from '../../../../api/business/businessOrder/feedbackOrderInfo'
import { getOrderInfo } from '../../../../api/baseApi'
import { searchType } from '../../../../api/baseApi'// 这接口也可以搜索业务小哥
import comControl from './control.vue'//控制器
import { parseTime } from '@/utils'

export default {
  components: { TableComponents },
  props: {},
  data() {
    return {
      defParams: defParams,
      option: option,
      initThData: initThData,
      info: [],
      tableData: [],
      has_receipt: [],
      attribution: [],
      businessType: [],
      outerVisible: false,
      downloadLoading: false,
      area: [],
      columnData: [],
      selectRow: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 200,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {console.log('编辑', row)},
          deleteOrder: this.deleteOrder,
          upLoadOrder: this.getLogList
        }
      },
      filterParam: {},
      isClear: 0,
      totalPage: 0,
      radio: 0,
      temp: {
        file_id: '',// 文件的id 字符串集合，
        predict_time: '',//预计到达时间
        fact_time: '',//实际到达时间
        courier_number: '',//收件单号
        send_single_number: '',//寄件单号
        recipients: '',//收件人
        recipients_tel: '',//收件人电话
        receipt_remark: '',//备注
        send_time: '',//默认时间~!
        order_id: ''// 订单ID
      },
      row: [],
      rules: {
        comment: [
          { required: true, message: '请输入新记录内容', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    length: {
      get() {
        if (this.defParams.pagesize) return this.defParams.pagesize + '条/页'
      },
      set(val) {
        this.defParams.pagesize = val
      }
    },
    pageData() {
      return {
        totalPageNum: this.totalPage,
        curPage: this.defParams.currpage
      }
    }
  },
  watch: {},
  async created() {
    await this.getTableList()
    this.mapTableTh()
  },
  mounted() {
  },
  methods: {
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
        config.width = item.width ? item.width : '140'
        comConfig.filterKey = item.key
        comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.name === '回单状态') {
          comConfig.comData = this.has_receipt
        }
        if (item.name === '发站归属地' || item.name === '到站归属地') {
          comConfig.comData = this.attribution
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    async getTableList(params) {
      let param
      params ? param = params : param = { ...defParams }
      await getFeedbackList(param).then((res) => {
        if (res.code == 200) {
          let { attribution, has_receipt, info, total_count, pagesize } = res.data
          this.info = res.data
          this.totalPage = total_count
          this.tableData = info
          this.has_receipt = has_receipt
          this.attribution = attribution
        }
      })
    },
    //去添加客户
    addClient() {
      this.$router.push({ path: 'createClientInfo' })
    },
    //改变显示数
    changePageLimit() {
      this.getTableList()
    },
    //* 单选事件
    getSelect(val) {this.selectRow = val},
    //设置表格样式
    headerCss() {return 'font-size:16px; font-weight: 800;'},
    // 筛选事件
    getFilter(val) {
      let param = Object.assign(this.defParams, val, { currpage: 1 })
      this.filterParam = { ...val }
      this.getTableList(param)
    },
    // 分页事件
    pageChange(num) {
      this.defParams.currpage = num
      this.getTableList(this.defParams)
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
    // 查询
    handleSearch() {
      this.getTableList()
    },

    exportList() {
      // let param = this.defParams
      // if (this.selectRow.length > 0) {
      //   param = this.selectRow
      // } else {
      //   param = this.tableData
      // }
      exportCustomer().then(() => {})
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
    },
    // 删除订单
    deleteOrder(row) {
      deleteList({ id: row.id }).then((res) => {
        if (res.code === 200) {
          this.tableData.splice(this.tableData.indexOf(row), 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 前端调导出
    exportExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    }
  },
  directives: {}
}
var tableConfig = {
  prop: '', // 参数字段
  label: '', // 名字
  type: '', // 类型当前表头交互类型
  hidden: false,//当前数据多.是否需要渲染
  isNeed: true,// 是否需要搜索项
  thIndex: null,
  component: null,// 表格Td 内部组件可以传
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
    filterKey: '',//字段对应表头字段
    placeholder: '输入姓名',
    comData: [],
    comProps: '',
    listInfo: {
      fetchData() {},
      callback: () => {}// 回调
    }
  }
}
var initThData = [
  {
    name: '回单状态',
    key: 'has_receipt',
    type: 'selectFilter'
  },
  {
    name: '操作人',
    key: 'opera_user',
    isNeed: false
  },
  {
    name: '订单号',
    key: 'order_num',
    type: 'editFilter'
  },
  {
    name: '运输批次',
    key: 'depart_batch',
    type: 'editFilter'
  },
  {
    name: '发站',
    key: 'start_city_string',
    type: 'editFilter'
  },
  {
    name: '发站归属地',
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
    name: '托运人电话',
    key: 'consignee_mobile',
    type: 'editFilter'
  },
  {
    name: '收车人',
    key: 'consignee',
    type: 'editFilter'

  },
  {
    name: '收车人电话',
    key: 'consignor_mobile',
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
    name: '运输司机',
    key: 'convey_driver',
    type: 'editFilter'
  },
  {
    name: '司机所属公司',
    key: 'convey_company',
    type: 'editFilter'
  },
  {
    name: '车牌号',
    key: 'convey_plate_number',
    type: 'editFilter'
  },
  {
    name: '开单日期',
    key: 'create_order_time',
    type: 'editFilter'
  },
  {
    name: '发车日期',
    key: 'departure_time',
    type: 'editFilter'
  },
  {
    name: '预期到达时间',
    key: 'predict_time',
    type: 'editFilter'

  },
  {
    name: '实际到达时间',
    key: 'fact_time',
    type: 'editFilter'
  },
  {
    name: '我方收件时间',
    key: 'receive_time',
    type: 'editFilter'
  },
  {
    name: '逾期天数',
    key: 'overdue',
    type: 'editFilter'
  },
  {
    name: '收件单号/来源',
    key: 'courier_number',
    type: 'editFilter'
  },
  {
    name: '收件人',
    key: 'recipients',
    type: 'editFilter'
  },
  {
    name: '收件人电话',
    key: 'recipients_tel',
    type: 'editFilter'
  },
  {
    name: '寄件时间',
    key: 'send_time',
    type: 'editFilter'
  },
  {
    name: '寄件单号/来源',
    key: 'send_single_number',
    type: 'editFilter'
  },
  {
    name: '备注',
    key: 'receipt_remark',
    isNeed: false
  }
]
var defParams = {
  query: '',// 搜索字段
  currpage: 1,
  pagesize: 10,// 条数
  order_num: '',// 订单号
  depart_batch: '',// 运输批次号
  start_city_string: '',//发站
  start_attribution: '',//发展归属地
  end_city_string: '',//到站
  end_attribution: '',//到站归属地
  consignor: '',//托运人
  consignor_mobile: '',//托运人电话
  consignee: '',//收车人
  consignee_mobile: '',//收车人电话
  car_brand_name: '',//货物名称
  heading_code: '',// 识别码
  convey_driver: '',// 运输司机集合
  convey_company: '',//运输司机公司集合
  convey_plate_number: '',// 车牌号集合
  create_order_time_start: '',//开单日期开始值
  create_order_time_end: '',// 开单日期结束值
  predict_time_start: '',//预期到达时间开始值
  predict_time_end: '',//预期到达时间结束值
  fact_time_start: '',//实际到达时间开始
  fact_time_end: '',//实际到达时间结束
  receive_time_start: '',//我方收件时间开始
  receive_time_end: '',//我方收件时间结束
  courier_number: '',//收件单号
  recipients: '',//收件人
  recipients_tel: '',//收件人电话
  send_time_start: '',//寄件时间开始
  send_time_end: '',//寄件时间结束
  send_single_number: ''//寄件单号
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
</script>
<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .page-title {
    font-size: j(30);
    padding: j(10) j(20);
    margin: j(5) 0;
    box-shadow: 0 2px 10px #f2f2f2;
    font-weight: 400;
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


  .table-wrap {
    padding: 0 j(20);
  }
</style>
