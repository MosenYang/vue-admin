<template>
  <div class="page">
    <div class="page-title flex-between">
      <span>回单信息</span>
      <el-button type="primary" icon="el-icon-plus" @click="addClient">
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
      <table-components :table-data="tableData" :selection="true" :pagination="true" :row-click="clickRow"
                        :action-config="actionConfig"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        @select-change="getSelect"
                        :headerCellStyle="headerCss"
                        @page-change="pageChange"/>
    </div>
    <!--联系记录-->
    <el-dialog title="联系记录" :visible.sync="outerVisible">
      <div class="block">
        <el-timeline style="padding-right: 40px">
          <el-timeline-item
            v-for="(item,index) in userLogs" :key="index"
            :timestamp="item.created_at" placement="top">
            <el-card style="padding: 0 0">
              <p>客户: {{ item.name}}</p>
              <h4>内容: {{ item.comment}}</h4>
              <p>维护人: {{item.username}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-dialog width="30%" title="新记录" :visible.sync="innerVisible" append-to-body>
        <el-form :model="ruleForm" label-position="top" ref="ruleForm" label-width="100px" :rules="rules">
          <el-form-item label="记录内容" prop="comment">
            <el-input type="textarea"
                      v-model="ruleForm.comment"
                      :autosize="{ minRows: 3, maxRows: 5}"
                      placeholder="请填写新纪录">

            </el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addLogs('ruleForm')">添加记录</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">添加记录</el-button>
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
      tableData: [],
      businessType: [],
      outerVisible: false,
      innerVisible: false,
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
      totalPage: 0,
      radio: 0,
      ruleForm: {
        comment: ''
      },
      row: [],
      people: mockPeople,
      userLogs: mockUserLogs,
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
        if (this.defParams.length) return this.defParams.length + '条/页'
      },
      set(val) {
        this.defParams.length = val
      }
    },
    pageData() {
      return {
        totalPageNum: this.totalPage,
        curPage: this.defParams.start
      }
    }
  },
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    mapTableTh() {
      console.log(this.initThData.length, '订单总表表格列数')
      this.initThData.forEach((item, index) => {
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
        if (item.name === '业务类型') {
          comConfig.comData = this.businessType
        }
        if (item.name === '省份') {
          comConfig.comData = this.area
        }
        if (item.name === '性别') {
          let sex = [
            { name: '男', key: 1 },
            { name: '女', key: 0 }
          ]
          comConfig.comData = sex
        }
        if (item.name === '客户类型') {
          let clientType = [
            { name: '潜在客户', key: 1 },
            { name: '正常客户', key: 2 }
          ]
          comConfig.comData = clientType
        }
        if (item.name === '是否审核') {
          let auditStatus = [
            { name: '已审核', key: 1 },
            { name: '未审核', key: 0 }
          ]
          comConfig.comData = auditStatus
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    getTableList(params) {
      let param
      params ? param = params : param = { ...defParams }
      clientSearch(param).then((res) => {
        if (res.code == 200) {
          this.totalPage = res.data.total
          this.tableData = res.data.info
        }
      })
    },
    async getData() {
      await this.getTableList()
      await searchType({ type: 'customer_business' }).then((res) => {
        if (res.code === 200) {
          Object.keys(res.data).forEach((item) => {
            this.businessType.push({
              key: item,
              name: res.data[item]
            })
          })
        }
      })
      await searchType({ type: 'area' }).then((res) => {
        if (res.code === 200) {
          this.area = res.data
        }
      })
      searchType({ type: 'saleman' }).then((res) => {
        if (res.code === 200) {
          if (res.data.length !== 0) {
            this.people = res.data
          }
        }
      })
      this.mapTableTh()
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
    getSelect(val) {
      this.selectRow = val
      console.log(val, '单选广播事件')
    },
    //设置表格样式
    headerCss() {
      return 'font-size:16px; font-weight: 800;'
    },
    //表行点击
    clickRow(row) {
      console.log(row, '点击了')
    },
    // 筛选事件
    getFilter(val) {
      let param = Object.assign(this.defParams, val, { start: 1 })
      this.filterParam = { ...val }
      this.getTableList(param)
    },
    // 分页事件
    pageChange(num) {
      this.defParams.start = num
      this.getTableList(this.defParams)
    },
    // 重置
    handleReset() {
      console.log(this.filterParam, '重置参数对象')
      let param = Object.assign(this.defParams, this.filterParam, { start: 1 })
      this.getTableList(param)
      this.isReaetParam = true//  直接重置需求.没开发
    },
    // 查询
    handleSearch() {
      this.getTableList()
    },
    // 添加记录
    addLogs(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.userLogs[0].customer_id
          let param = { comment: this.ruleForm.comment, customer_id: id }
          logsAdd(param).then((res) => {
            if (res.code == 200) {
              this.getLogList()
              this.$message({
                message: '添加成功!',
                type: 'success'
              })
              this.ruleForm.comment = null
              this.innerVisible = false
            }
          })
        } else {
          console.log('表单错误!!')
          return false
        }
      })
    },
    getLogList(row) {
      if (row) this.row = row
      logsShow({ id: this.row.id }).then((res) => {
        if (res.code == 200) {
          if (res.data.length !== 0) {// 没数据,使用mock
            this.userLogs = res.data
          }
          console.log('记录列表!', res.data)
          this.outerVisible = true
        }
      })
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
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
    type: 'editFilter'
  },
  {
    name: '订单号',
    key: 'order_num',
    type: 'editFilter'
  },
  {
    name: '运输批次',
    key: 'depart_batch',
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
    type: 'selectFilter'
  },
  {
    name: '收车人',
    key: 'consignee',
    type: 'editFilter'

  },
  {
    name: '收车人电话',
    key: 'consignor_mobile',
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
    name: '运输司机',
    key: 'convey_driver',
    type: 'selectFilter'
  },
  {
    name: '司机所属公司',
    key: 'convey_company',
    type: 'selectFilter'
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
    type: 'editFilter'
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
  receive_time_start:'',//我方收件时间开始
  receive_time_end:'',//我方收件时间结束
  courier_number:'',//收件单号
  recipients:'',//收件人
  recipients_tel:"",//收件人电话
  send_time_start:'',//寄件时间开始
  send_time_end:'',//寄件时间结束
  send_single_number:"",//寄件单号
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
var mockPeople = [
  {
    'id': 1,  //业务员id
    'name': '李磊'  //业务员姓名
  },
  {
    'id': 2,  //业务员id
    'name': '韩梅梅'  //业务员姓名
  },
  {
    'id': 3,  //业务员id
    'name': '韩梅'  //业务员姓名
  }
]
var mockUserLogs = [
  {
    'id': 1,
    'customer_id': 17, //客户id
    'name': '隔壁老王',  //客户姓名
    'username': 'Sandy',  //维护人
    'comment': '吃饭睡觉打豆豆',  //维护内容
    'created_at': '2019-06-12 19:22:32'  //记录添加时间
  },
  {
    'id': 1,
    'customer_id': 17, //客户id
    'name': '隔壁老李',  //客户姓名
    'username': 'Mosen',  //维护人
    'comment': '吃饭睡觉打飞机',  //维护内容
    'created_at': '2019-06-15 10:22:32'  //记录添加时间
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
