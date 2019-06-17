<template>
  <div class="totalTable-page">
    <div class="totalTable-header">
      <div>订单总表</div>
      <div class="header-btns">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-document"
          @click="handleCreate"
        >
          创建订单
        </el-button>
        <el-button v-waves
                   :loading="downloadLoading"
                   class="filter-item"
                   type="primary"
                   icon="el-icon-download"
                   @click="handleDownload">
          导出模板
        </el-button>
        <el-button v-waves
                   :loading="downloadLoading"
                   class="filter-item"
                   type="primary"
                   icon="el-icon-download"
                   @click="handleDownload">
          导入订单
        </el-button>
      </div>
    </div>
    <div class="totalTable-container">
      <div class="flex-between control">
        <div class="limit">
          当前显示:
          <el-select v-model="listQuery.limit+'条/每页'" value-key="value" placeholder="条/页" size="mini">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item"
              @change="changePage">
            </el-option>
          </el-select>
        </div>
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>查询:</span>
            <el-input
              v-model="listQuery.title"
              placeholder="请写查询内容"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              查询
            </el-button>
          </div>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleReset">
            重置
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="clearFilter">
            导出
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="clearFilter">
            审核
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="clearFilter">
            多装车
          </el-button>
        </div>
      </div>
      <!--表格-->
      <table-components :table-data="list" :selection="true"
                        :pagination="true"
                        :row-click="onClickHandle"
                        :action-config="actionConfig"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        @select-change="getselect"
                        :headerCellStyle="headerCell"
                        @page-change="getpage"/>
      <!--弹窗-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="70px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="Type" prop="type">
            <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
              <el-option v-for="item in calendarTypeOptions"
                         :key="item.key"
                         :label="item.display_name"
                         :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
          </el-form-item>
          <el-form-item label="Title" prop="title">
            <el-input v-model="temp.title"/>
          </el-form-item>
          <el-form-item label="Status">
            <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Imp">
            <el-rate v-model="temp.importance"
                     :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                     :max="3"
                     style="margin-top:8px;"
            />
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="temp.remark"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      type="textarea"
                      placeholder="Please input"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="key" label="Channel"/>
          <el-table-column prop="pv" label="Pv"/>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </el-dialog>
      <el-dialog title="上传" :visible.sync="dialogVisible" width="40%">
        <loadFile/>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getRoles } from '@/api/role'
import { testLogin } from '@/api/address'
import TableComponents from '../../components/Tables/dg-table'
import searchText from '../../components/Tables/defFilter/searchText.vue'//搜索
import comControl from './component/control.vue'//控制器

import waves from '@/directive/waves' // 指令
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import loadFile from '@/components/Upload/SingleImage'
import { getOrderMsg, orderIndex, getOrderInfo } from '../../../../api/businessOrder/order'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
let initTHData = [
  {
    name: '订单号',
    isNeed: true,//是否需要搜索,
    type: 'text'// 搜索类型
  },
  {
    name: '发车批次',
    isNeed: true,//是否需要搜索,
    type: 'text'// 搜索类型
  },
  {
    name: '运单号',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '订单状态',//表头label
    isNeed: true,//是否需要搜索
    type: 'select'// 搜索类型
  },
  {
    name: '审核状态',//表头label
    isNeed: true,//是否需要搜索
    type: 'select'// 搜索类型
  },
  {
    name: '订单分类',//表头label
    isNeed: true,//是否需要搜索
    type: 'select'// 搜索类型
  },
  {
    name: '发站',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '发站归属地',//表头label
    isNeed: true,//是否需要搜索
    width: 140,
    type: 'select'// 搜索类型
  },
  {
    name: '中转归属地',//表头label
    isNeed: true,//是否需要搜索
    type: 'select'// 搜索类型
  },
  {
    name: '到站',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '托运人',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '托运人电话',//表头label
    isNeed: true,//是否需要搜索
    width: 140,
    type: 'text'// 搜索类型
  },
  {
    name: '收货人',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '收货人电话',//表头label
    isNeed: true,//是否需要搜索
    width: 140,
    type: 'text'// 搜索类型
  },
  {
    name: '货物名称',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '识别码',//表头label
    isNeed: true,//是否需要搜索
    type: 'text'// 搜索类型
  },
  {
    name: '现付',//表头label
    type: 'text'// 搜索类型
  },
  {
    name: '到付',//表头label
    type: 'text'// 搜索类型
  },
  {
    name: '月结',//表头label
    type: 'text'// 搜索类型
  },
  {
    name: '付款方式',//表头label
    isNeed: true,//是否需要搜索
    type: 'select'// 搜索类型
  },
  {
    name: '合计运费',//表头label
    type: 'text',// 搜索类型
    isNeed: false
  },
  {
    name: '经办人',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '业务类型',//表头label
    isNeed: true,
    type: 'select'// 搜索类型
  },
  {
    name: '所属公司',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '运输司机名字',//表头label
    isNeed: true,
    width: 140,
    type: 'text'// 搜索类型
  },
  {
    name: '司机电话',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '提车司机',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '送车司机',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '运输次数',//表头label
    isNeed: true,
    type: 'select'// 搜索类型
  },
  {
    name: '开单日期',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '状态修改人',//表头label
    isNeed: true,
    type: 'text',// 搜索类型
    width: 140
  },
  {
    name: '审核人',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '审核时间',//表头label
    isNeed: true,
    type: 'text'// 搜索类型
  },
  {
    name: '回单',//表头label
    isNeed: true,
    type: 'select'// 搜索类型
  },
  {
    name: '备注'//表头label
  }
]
export default {
  name: 'totalTable',
  data() {
    return {
      tableKey: 0,
      list: null,// 表格数据
      columnData: [],
      total: 0,// 总条数
      listLoading: true,//是否加载
      dialogVisible: false,
      listQuery: {// 分页器
        page: 1,
        limit: 11,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      pageData: {
        pageNum: 10,
        curPage: 1
      },
      actionConfig,
      option,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      multipleSelection: [], // 多选的
      downloadLoading: false,
      search: '',
      typeValue: null
    }
  },
  components: { Pagination, loadFile, TableComponents, comControl },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async getTableList(params) {
      this.listLoading = true
      params ? params : params = { ...defParams }
      await orderIndex(params).then(response => {
        if (response.code === 200) {
          let { orders_data, total_count } = response.data.info
          console.log(response.data.info.orders_data, total_count, '总表数据')
          this.list = orders_data
          this.total = total_count
          this.mapTableTh()
        }
        this.listLoading = false
      })
    },
    mapTableTh() {
      //初始化表格表头名称数据.根据业务来的,顺序必须一致
      Object.keys(this.list[0]).forEach((item, i) => {
        let defTableConfig = {
          prop: '', // 参数字段
          label: '', // 名字
          type: '', // 类型当前表头交互类型
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
        defTableConfig.prop = item // 数据字段
        defTableConfig.thIndex = i
        defTableConfig.isNeed = initTHData[i].isNeed ? defTableConfig.isNeed:false
        defTableConfig.label = defTableConfig.filterConfig.label = initTHData[i].name
        defTableConfig.type = defTableConfig.filterConfig.type = initTHData[i].type
        if (defTableConfig.type === 'text') {// 自定义 可传参
          defTableConfig.filterConfig.component = searchText
        }
        if (initTHData[i].width) {
          defTableConfig.width = initTHData[i].width
        } else {
          defTableConfig.width = '120'
        }
        this.columnData.push(defTableConfig)
      })
      console.log(this.columnData, '表头数据')
    },
    headerCell() {
      return 'font-size:16px;'
    },
    onClickHandle() {},
    // 删选项事件
    getFilter(val) {
      // console.log(val, '筛选')
      const allfilter = {
        filters: val,
        page: 1
      }
      this.filters = val
      const res = dofilter(allfilter)
      this.data = res.data
      this.pagenum = res.pagenum
    },
    //
    getselect(val) {
      console.log(val, '单选广播事件')
    },
    // 分页事件
    getpage(page) {
      this.curpage = page
      const allfilter = {
        filters: this.filters,
        page
      }
      const res = dofilter(allfilter)
      this.data = res.data
    },
    //
    customFieldColumn(h, { column, $index }) {
      return h('span', [
        h('el-input', { props: {} }
        )
      ])
    },
    beginUnloadHandle() {
      this.dialogVisible = true
    },
    handleTeset() {
      const params = {
        email: '807037603@qq.com',
        password: '123456'
      }
      getRoles().then()
      testLogin(params).then((res) => {
        console.log('res', res)
      })
    },
    // 重置
    handleReset() {
      const params = {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
      this.getTableList(params)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getTableList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 表格筛选
    filterTag(value, row) {
      return row.tag === value
    },
    changePage(val) {
      console.log('val', val)
      // let { value } = val
      // let v = { pagesize: value }
      // let param = { ...defParams, ...v }
      // this.getTableList(param)
    },
    // 重置表格删选
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log('0')
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
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
    },
    handleSelectionChange(val) {
      console.log('多选', val)
      this.multipleSelection = val
    },
    tableSearch() {
      this.listQuery.page = 1
      this.getTableList()
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
var defTableConfig = {
  prop: '', // 参数字段
  label: '', // 名字
  type: '', // 类型当前表头交互类型
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
var option = [
  {
    value: '10',
    label: '10条/页'
  }, {
    value: '20',
    label: '30条/页'
  }, {
    value: '50',
    label: '50条/页'
  }, {
    value: '100',
    label: '100条/页'
  }
]
var actionConfig = {
  type: 'customize',
  label: '操作区',
  width: 370,
  fixed: true,
  component: comControl,
  handlers: {
    firsth: (row) => { console.log('first', row) },
    second: (row) => { console.log('second', row) }
  }
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
