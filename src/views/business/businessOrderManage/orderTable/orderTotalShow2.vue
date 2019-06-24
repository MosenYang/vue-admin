<template>
  <div class="app-container">
    <!--查询项-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请写查询条件"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.importance" placeholder="下拉" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">
        创建订单
      </el-button>
      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        评审
      </el-checkbox>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleReset">
        更新数据
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleTeset">
        测试
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="clearFilter">
        重置筛选
      </el-button>
    </div>
    <!--表格-->
    <el-table
      v-if="a==true"
      :key="tableKey"
      ref="filterTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column fixed label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status!='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published')"
          >
            发行
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            打样
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- 新的交互-->
      <el-table-column label="主题" width="100px" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="bottom"
                      width="100"
                      trigger="hover">
            <el-input v-model="search"
                      size="mini"
                      @blur="blur00"
                      placeholder="输入关键字搜索"/>
            <div slot="reference">主题</div>
          </el-popover>
        </template>
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单号" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"/>
      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px" align="center">
        <template slot="header" slot-scope="scope">
          <div>标题</div>
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="100px" align="center">
        <template slot="header" slot-scope="scope">
          <div>作者</div>
          <el-input v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="评审人" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="星级" width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>
      </el-table-column>
      <el-table-column
        label="点击率"
        align="center"
        width="95"
        :filters="[{ text: '家', value: '895' }, { text: '公司', value: '4894' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!---->
    <table-component :table-data="list"
                     :selection="true"
                     :pagination="true"
                     :row-click="onClickHandle"
                     :action-config="actionConfig"
                     :page-config="pageData"
                     :column-config="columnData"
                     @filter-change="getFilter"
                     @select-change="getselect"
                     :headerCellStyle="headerCell"
                     @page-change="getpage"
    ></table-component>

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
            <el-option
              v-for="item in calendarTypeOptions"
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
          <el-rate
            v-model="temp.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"
          />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input
            v-model="temp.remark"
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
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getRoles } from '@/api/role'
import { testLogin } from '@/api/address'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import tableComponent from '../../components/Tables/dg-table2'
import comControl from './component/control.vue'//控制器

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

export default {
  name: 'ComplexTable',
  components: { Pagination, tableComponent },
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
  data() {
    return {
      a: false,
      visible: false,
      columnData: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 260,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            console.log('first', row)
            this.$router.push({ path: 'businessAlterOrder' })
          },
          btnHandle: this.btnHandle,
          deleteOrder: this.handleDelete,
          upLoadOrder: () => {this.dialogVisible = true}
        }
      },
      pageData: {
        totalPageNum: 100,
        curPage: 1
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 11,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      renderTypeHeader() {},
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
  created() {
    this.getList()
  },
  methods: {
    blur00() {
      alert('1')
    },
    getFilter() {},
    getselect() {},
    headerCell() {},
    handleTeset() {
      const params = {
        email: '807037603@qq.com',
        password: '123456'
      }
      getRoles().then()
      testLogin(params).then((res) => {
        console.log('登录接口', res)
      })
    },
    getpage() {},
    onClickHandle() {},
    mapTableTh() {
      let initTHData = [
        {
          name: '作者',
          isNeed: true,//是否需要搜索,
          key: 'author'
        },
        {
          name: '模块有无',
          isNeed: true,//是否需要搜索,
          key: 'comment_disabled'
        },
        {
          name: '内容',//表头label
          key: 'content'
        },
        {
          name: '订单状态',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',
          key: 'order_status'
        },
        {
          name: '内容排序',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',
          key: 'content_short'
        },
        {
          name: '显示时间',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',
          key: 'display_time'
        },
        {
          name: '常量',//表头label
          isNeed: true,//是否需要搜索
          key: 'forecast'
        },
        {
          name: 'ID',//表头label
          width: 160,
          type: 'editFilter',// 搜索类型
          key: 'id'
        },
        {
          name: '图片地址',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',
          width: 160,
          key: 'image_uri'
        },
        {
          name: '导出',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',
          key: 'importance'
        },
        {
          name: '页面视图',
          isNeed: true,
          type: 'editFilter',
          width: 160,
          key: 'pageviews'
        },
        {
          name: '托运表单',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',// 搜索类型
          key: 'platforms'
        },
        {
          name: '重置',//表头label
          isNeed: true,//是否需要搜索
          width: 140,
          key: 'reviewer'
        },
        {
          name: '状态',//表头label
          isNeed: true,//是否需要搜索
          key: 'status'
        },
        {
          name: '时间戳',//表头label
          isNeed: false,//是否需要搜索
          width: 140,
          key: 'timestamp'
        },
        {
          name: '标题',//表头label
          isNeed: true,//是否需要搜索
          key: 'title'
        },
        {
          name: '类型',//表头label
          isNeed: true,//是否需要搜索
          type: 'editFilter',// 搜索类型
          key: 'type'
        }
      ]
      console.log(initTHData.length, '订单总表表格列数')
      this.columnData = []
      initTHData.forEach((item, index) => {
        let config = { ...tableConfig }
        let comConfig = { ...tableConfig.filterConfig }
        config.prop = item.key // 数据字段
        config.thIndex = index
        config.isNeed = true
        config.isNeed = item.isNeed ? item.isNeed : false
        config.label = comConfig.label = item.name
        config.type = comConfig.type = item.type
        config.width = item.width ? item.width : '120'
        comConfig.filterKey = item.key
        if (config.type) {
          comConfig.component = item.type // searchFilter
        }
        if (item.name === '运输次数') {
          // comConfig.component = selectFilter
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
      console.log(this.columnData, '表头数据')
    },
    getList(params) {
      this.listLoading = true
      if (!params) {
        params = this.listQuery
      }
      fetchList(params).then(response => {
        console.log(response, 'res数据')
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        this.mapTableTh()
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
      this.getList(params)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    handleSelectionChange(val) {
      console.log('多选', val)
      this.multipleSelection = val
    },
    tableSearch() {
      this.listQuery.page = 1
      this.getList()
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
    component: null,// 传入的组件|| 或组件名称
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
</script>
<style lang="scss" scoped>

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
