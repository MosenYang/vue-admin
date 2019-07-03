<template>
  <div class="totalTable-page">
    <div class="totalTable-header">
      <div>订单总表</div>
      <div class="header-btns">
        <el-button class="filter-item"
                   style="margin-left: 10px;"
                   type="primary"
                   icon="el-icon-document"
                   @click="handleCreate">
          创建订单
        </el-button>
        <el-button v-waves
                   :loading="downloadLoading"
                   class="filter-item"
                   type="primary"
                   icon="el-icon-download"
                   @click="downloadTemplate">
          导出模板
        </el-button>
        <el-button v-waves
                   :loading="downloadLoading"
                   class="filter-item"
                   type="primary"
                   icon="el-icon-download"
                   @click="requireExcel">
          导入订单
        </el-button>
      </div>
    </div>
    <div class="totalTable-container">
      <div class="flex-between control">
        <div class="limit">
          当前显示:
          <el-select v-model="pageNum" @change="changePage" placeholder="Please select">
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>查询:</span>
            <el-input
              v-model="defParams.global_query"
              placeholder="请写查询内容"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleSearch"
            />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                       @click="handleSearch">
              查询
            </el-button>
          </div>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                     @click="handleReset">
            重置
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                     @click="DownloadFile">
            导出
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                     @click="auditHandle">
            审核
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                     @click="onTruckHandle">
            多装车
          </el-button>
        </div>
      </div>
      <!--表格-->
      <table-components :table-data="list" :selection="true"
                        :pagination="true"
                        :isClear="isClear"
                        :action-config="actionConfig"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        @select-change="getselect"
                        :headerCellStyle="headerCell"
                        @page-change="getpage"/>
      <!--图片上传-->
      <el-dialog title="上传凭证图片" :visible.sync="dialogVisible" width="40%">
        <load-pic></load-pic>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!--导出Excel文件-->
      <el-dialog title="导出Excel文件" :visible.sync="dialogExcelVisible" width="70%">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogExcelVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogExcelVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!--多装车-->
      <el-dialog title="多装车" :visible.sync="trucking" width="70%" center>
        <!--表格-->
        <table-components :table-data="truckDataList" :selection="true" :pagination="true"
                          :isClear="isClear"
                          :column-config="truckColumnData"
                          :page-config="truckPage"
                          @filter-change="filterTruck"
                          @select-change="selectTruck"
                          :headerCellStyle="headerCell"
                          @page-change="TruckPageChange"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetTruck">重置</el-button>
          <el-button type="primary" @click="truckCar">装车</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  checkOrder,
  destroyOrder,
  orderIndex,
  getOrderInfo,
  importExcel,
  importExcelTemplate,
  moreLoading
} from '../../../../api/business/businessOrder/order'
import TableComponents from '../../components/Tables/dg-table2'//动态表格
import selectFilter from '../../components/Tables/defFilter/selectFilter.vue'//搜索
import comControl from './component/control.vue'//控制器
import waves from '@/directive/waves' // 指令
import { parseTime, requestJS } from '@/utils'
// import unLoadExcel from '@/components/uploadExcel/Excel'// 文件上传(并没有写)
import loadPic from '@/components/Upload/upLoadFile'// 图片上传
export default {
  name: 'totalTable',
  data() {
    return {
      tableKey: 0,
      list: null,// 表格数据
      info: null,//总数据
      area: [],//归属地
      columnData: [],//表头配置
      listLoading: true,//是否加载
      defParams: defParams,
      defTruckParams: defTruckParams,
      selectRow: [],// 行数据
      selectTruckRow: [],
      dialogExcelVisible: false,//上传表格
      dialogVisible: false,// 上传图片
      file: '',
      trucking: false,// 是否装车
      option,
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      search: '',
      typeValue: null,
      truckData: [],
      truckColumnData: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 370,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            this.$router.push({ path: 'businessAlterOrder' })
          },
          btnHandle: this.btnHandle,
          deleteOrder: this.handleDelete,
          upLoadOrder: this.upLoadPic
        }
      },
      filterParam: {},//删选条件
      filterTruckParam: {},
      isClear: 0
    }
  },
  components: { loadPic, TableComponents, comControl, selectFilter },
  directives: { waves },
  filters: {},
  computed: {
    pageNum: {
      get() {
        if (this.defParams.pagesize) {
          return this.defParams.pagesize + '条/每页'
        }
      },
      set(val) {
        this.defParams.pagesize = val
      }
    },
    pageData: {
      get() {
        if (this.info) {
          return {
            totalPageNum: this.info.total_count,
            curPage: 1
          }
        }
      }
    },
    truckPage: {
      get() {
        return {
          totalPageNum: this.truckData.total_count,
          curPage: 1
        }
      }
    },
    truckDataList: {
      get() {
        return this.truckData.data
      }
    }
  },
  created() {
    this.getTableList()
    this.getArea()
  },
  methods: {
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
        if (item.name === '车辆状态') {
          comConfig.comData = [{
            name: '未发车',
            value: 0
          }, {
            name: '闲置中',
            value: 1
          }, {
            name: '运输中',
            value: 2
          }]
        }
        config.filterConfig = comConfig
        this.truckColumnData.push(config)
      })
    },
    //* 多装车
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
    truckCar() {
      if (this.selectTruckRow.length >= 1) {
        //没有接口
        return
      }
      return this.$message({
        type: 'warning',
        message: '请选择车辆!'
      })
    },

    //  * 前端下载文件
    handleDownload0() {
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
    // 导出模板
    downloadTemplate() {
      importExcelTemplate().then((res) => {
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
    },
    DownloadFile() {
      this.downloadLoading = true
      importExcel().then().catch()
    },
    requireExcel() {
      this.dialogExcelVisible = true
    },
    upLoadPic() {
      this.dialogVisible = true
    },
    //* 审核
    auditHandle() {
      if (this.selectRow.length >= 1) {
        let data = []
        this.selectRow.forEach((item, index) => {
          if (item.is_audit == '未审核') {
            data.push(item.id)
          }
        })
        let param = { ids: data.join() }
        checkOrder(param).then((res) => {
          if (res.code == 200) {
            this.getTableList()
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
          showClose: true,
          message: '请先选择订单'
        })
      }
    },
    //* 创建订单
    handleCreate() {
      this.$router.push({ path: 'businessCreateOrder' })
    },
    //* 单选事件
    getselect(val) {
      this.selectRow = val
      console.log(val, '单选广播事件')
    },
    headerCell() {
      return 'font-size:16px; font-weight: 800;'
    },
    // 筛选事件
    getFilter(val) {
      console.log(val, '筛选')
      let param = Object.assign(this.defParams, val, { currpage: 1 })
      this.filterParam = { ...val }
      this.getTableList(param)
    },
    // 分页事件
    getpage(page) {
      this.defParams.currpage = page
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
    //* 搜索
    handleSearch() {
      if (this.defParams.global_query) {
        this.defParams.page = 1
        this.getTableList(this.defParams)
      } else {
        this.$message({
          showClose: true,
          message: '请输入查询类容',
          type: 'warning'
        })
      }
    },
    btnHandle(row, item) {
      // 0: {name: "验车", value: 1}
      // 1: {name: "入库", value: 2}
      // 2: {name: "复验", value: 3}
      // 3: {name: "到达", value: 4}
      // 4: {name: "自提", value: 5}
      // 5: {name: "送车", value: 6}
      // 6: {name: "交车", value: 7}
      if (item == '验车') {

      }
      if (item == '入库') {

      }
      if (item == '复验') {

      }
      if (item == '自提') {

      }
      if (item == '送车') {

      }
      if (item == '交车') {

      }
      console.log('item', item)
    },
    //* 切换条数显示
    changePage(val) {
      this.defParams.currpage = 1
      this.defParams.pagesize = val
      this.getTableList(this.defParams)
    },
    //* 订单删除
    handleDelete(row) {
      let param = { id: row.id }
      destroyOrder(param).then((res) => {
        if (res.code === 200) {
          const index = this.list.indexOf(row)// 返回首次出现的下标
          this.list.splice(index, 1)
          return this.$message({
            showClose: true,
            message: '删除成功'
          })
        }
        return this.$message({
          showClose: true,
          type: 'success',
          message: '删除失败'
        })
      })
    },
    // * 获取数据
    async getTableList(params) {
      this.listLoading = true
      if (params) {// 可删除
        console.log('参数', params)
      }
      params ? params : params = { ...defParams }
      await orderIndex(params).then(response => {
        if (response.code === 200) {
          this.info = response.data.info
          let { orders_data } = response.data.info
          this.list = orders_data
          // console.log(response.data.info.orders_data, total_count, '总表数据')
          this.mapTableTh()
        }
        this.listLoading = false
      })
    },
    getArea() {
      getOrderInfo({ type: 6 }).then((res) => {
        if (res.code == 200) {
          this.area = res.data.info
        }
      })
    },
    //* 初始化表格表头名称数据
    mapTableTh() {
      console.log(initTHData.length, '订单总表表格列数')
      this.columnData = []
      initTHData.forEach((item, index) => {
        let config = { ...tableConfig }
        let comConfig = { ...tableConfig.filterConfig }
        let {
          type_of_business_s,
          transfer_status_s,
          order_type_param_s,
          order_status_param_s,
          order_payment_method_s,
          is_audit_s, has_receipt_s
        } = this.info

        config.prop = item.key // 数据字段
        config.thIndex = index
        config.isNeed = item.isNeed ? config.isNeed : false
        config.label = comConfig.label = item.name
        config.type = comConfig.type = item.type
        config.width = item.width ? item.width : '140'
        comConfig.filterKey = item.key
        comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.name === '发站归属地' || item.name === '中转归属地' || item.name === '到站归属地') {
          comConfig.comData = this.area
        }
        if (item.name === '业务类型') {
          comConfig.comData = type_of_business_s
        }
        if (item.name === '运输次数') {
          comConfig.comData = transfer_status_s
        }
        if (item.name === '订单分类') {
          comConfig.comData = order_type_param_s
        }
        if (item.name === '订单状态') {
          comConfig.comData = order_status_param_s
        }
        if (item.name === '付款方式') {
          comConfig.comData = order_payment_method_s
        }
        if (item.name === '审核状态') {
          comConfig.comData = is_audit_s
        }
        if (item.name === '回单') {
          comConfig.comData = has_receipt_s
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
      console.log(this.columnData, '表头数据')
    }
  }
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
    filterKey: 'uid',//字段对应表头字段
    placeholder: '输入姓名',
    comData: [],
    comProps: '',
    listInfo: {
      fetchData() {},
      callback: () => {}// 回调
    }
  }
}
var defParams = {
  pagesize: 10,
  currpage: 1,
  global_query: '',
  consignee: '',//收货人
  car_brand_name: '',
  order_num: '',
  depart_batch: '',
  order_status: '', // 1:临时订单 2.未验车3:已验车4:已入库 5:未发车；6:运输中；7:已复验；8:已到达;9:送车中;10:已到达 11.已完结
  is_audit: null,//1
  order_type: null,//订单的分类 例如 0.暂无类型 1.铁路订单 2.公路订单 3微信订单 4.船运订单
  start_city_string: '',
  start_attribution: '',
  end_city_string: '',
  end_attribution: '',//归属
  consignor: '',// 托运人
  consignor_mobile: '',//电话
  heading_code: '',//识别码
  payment_method: '',// 付款方式
  operator: '',//经办人
  type_of_business: '',//业务类型
  convey_company: '',
  convey_driver: '',//运输司机
  convey_driver_tel: '',//运输司机电话
  carry_car_name: '',//提车司机
  send_car_name: '',//送车司机
  transfer_status: '',//中转状态
  create_order_time_start: '',// 开始时间
  create_order_time_end: '',// '结束时间',
  who_handle_name: '',//'状态修改人',
  audit_time_start: '',//'审核时间开始值',
  audit_time_end: '',//'审核时间结束值',
  has_receipt: ''//'有无回单'
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
var initTHData = [
  {
    name: '订单号',
    isNeed: true,//是否需要搜索,
    type: 'editFilter',// 搜索类型
    key: 'order_num',
    width: 180
  },
  {
    name: '发车批次',
    isNeed: true,//是否需要搜索,
    type: 'editFilter',// 搜索类型
    key: 'depart_batch'
  },
  {
    name: '运单号',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',// 搜索类型
    key: 'tran_num'
  },
  {
    name: '订单状态',//表头label
    isNeed: true,//是否需要搜索
    type: 'selectFilter',
    key: 'order_status'
  },
  {
    name: '审核状态',//表头label
    isNeed: true,//是否需要搜索
    type: 'selectFilter',
    key: 'is_audit'
  },
  {
    name: '共享状态',//表头label
    isNeed: true,//是否需要搜索
    type: 'selectFilter',
    key: 'is_audit'// 新字段
  },
  {
    name: '订单分类',//表头label
    isNeed: true,//是否需要搜索
    type: 'selectFilter',
    key: 'order_type'
  },
  {
    name: '发站',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',
    key: 'start_city_string'
  },
  {
    name: '发站归属地',//表头label
    isNeed: true,//是否需要搜索
    width: 160,
    type: 'selectFilter',// 搜索类型
    key: 'start_attribution'
  },
  {
    name: '中转归属地',//表头label
    isNeed: true,//是否需要搜索
    type: 'selectFilter',
    width: 160,
    key: 'transfer_place'
  },
  {
    name: '到站',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',
    key: 'end_city_string'
  },
  {
    name: '到站归属地',
    isNeed: true,
    type: 'selectFilter',
    width: 160,
    key: 'end_attribution'
  },
  {
    name: '托运人',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',// 搜索类型
    key: 'consignor'
  },
  {
    name: '托运人电话',//表头label
    isNeed: true,//是否需要搜索
    width: 160,
    type: 'editFilter',
    key: 'consignor_mobile'
  },
  {
    name: '收货人',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',
    key: 'consignee'
  },
  {
    name: '收货人电话',//表头label
    isNeed: true,//是否需要搜索
    width: 160,
    type: 'editFilter',
    key: 'consignee_mobile'
  },
  {
    name: '货物名称',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',
    key: 'car_brand_name'
  },
  {
    name: '识别码',//表头label
    isNeed: true,//是否需要搜索
    type: 'editFilter',// 搜索类型
    key: 'heading_code'
  },
  {
    name: '现付',//表头label
    type: 'editFilter',// 搜索类型
    key: 'pay_cash'
  },
  {
    name: '到付',//表头label
    type: 'editFilter',// 搜索类型
    key: 'freight_collect'
  },
  {
    name: '月结',//表头label
    type: 'editFilter',// 搜索类型
    key: 'monthly_statement'
  },
  {
    name: '付款方式',//表头label
    isNeed: true,//是否需要搜索
    type: 'selectFilter',
    key: 'payment_method'
  },
  {
    name: '合计运费',//表头label
    type: 'editFilter',// 搜索类型
    isNeed: false,
    key: 'total_cost'
  },
  {
    name: '经办人',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'operator'
  },
  {
    name: '业务类型',//表头label
    isNeed: true,
    type: 'selectFilter',
    key: 'type_of_business'
  },
  {
    name: '所属公司',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'convey_company'
  },
  {
    name: '运输司机名字',//表头label
    isNeed: true,
    width: 160,
    type: 'editFilter',
    key: 'convey_driver'
  },
  {
    name: '司机电话',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'convey_driver_tel'
  },
  {
    name: '提车司机',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'carry_car_name'
  },
  {
    name: '送车司机',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'send_car_name'
  },
  {
    name: '运输次数',//表头label
    isNeed: true,
    type: 'selectFilter',
    key: 'transfer_status'
  },
  {
    name: '开单日期',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'create_order_time'
  },
  {
    name: '状态修改人',//表头label
    isNeed: true,
    type: 'editFilter',// 搜索类型
    width: 160,
    key: 'who_handle_name'
  },
  {
    name: '审核人',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'audit_people'
  },
  {
    name: '审核时间',//表头label
    isNeed: true,
    type: 'editFilter',
    key: 'audit_time'
  },
  {
    name: '回单',//表头label
    isNeed: true,
    type: 'selectFilter',
    key: 'has_receipt'
  },
  {
    name: '备注',
    key: 'remark'
  }
]
var truckThData = [
  {
    name: '公司名称',
    key: 'company',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '司机名称',
    key: 'driver_name',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '司机电话',
    key: 'mobile',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '车牌号',
    key: 'license_plate_number',
    type: 'editFilter',
    paramKey: null,
    isNeed: true
  },
  {
    name: '车位数',
    key: 'parking_spaces_num',
    paramKey: null
  },
  {
    name: '已装车数',
    key: 'car_num',
    paramKey: null
  },
  {
    name: '车辆状态',
    key: 'now_status',
    paramKey: null,
    type: 'selectFilter',
    isNeed: true
  },
  {
    name: '出发地',
    key: 'start_address',
    paramKey: null
  },
  {
    name: '主线路',
    key: 'main_circuit',
    paramKey: null,
    type: 'editFilter',
    isNeed: true
  }
]
var defTruckParams = {
  pagesize: 10,
  currpage: 1,
  now_status: '',
  company: '',
  driver_name: '',
  mobile: '',
  license_plate_number: '',
  main_circuit: ''
}
</script>
<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .totalTable-page {
    height: 100%;
    color: #262626;

    .totalTable-header {
      @extend %space-between;
      padding: j(15) j(20);
      font-size: j(30);
      font-weight: 800;
      box-shadow: 0 2px 10px #f2f2f2;

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
  }
</style>
