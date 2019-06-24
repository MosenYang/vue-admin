<template>
  <div class="page">
    <div class="page-title flex-between">
      <span>客户信息</span>
      <el-button type="primary" @click="addClient">
        添加客户
      </el-button>
    </div>
    <div class="totalTable-container">
      <div class="flex-between control">
        <div class="limit">
          当前显示:
          <el-select v-model="length"
                     @change="changePageLimit" placeholder="请选择">
            <el-option v-for="item in option"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"/>
          </el-select>
        </div>
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>查询:</span>
            <el-input
              v-model="defParams.query"
              placeholder="请写查询内容"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleSearch"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button @click="handleReset"
                     class="filter-item"
                     type="primary"
                     icon="el-icon-search">
            重置
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search">
            导出
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search">
            导入
          </el-button>
          <el-button class="filter-item" @click="changePeople" type="primary" icon="el-icon-search">
            修改维护人
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <table-components :table-data="tableData" :selection="true"
                        :pagination="true"
                        :row-click="clickRow"
                        :action-config="actionConfig"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        @select-change="getselect"
                        :headerCellStyle="headerCss"
                        @page-change="pageChange"/>
    </div>
    <!---->
    <el-dialog title="修改维护人" :visible.sync="dialogVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item>
          <el-radio-group v-model="radio">
            <el-radio :label="item.id" v-for="(item,i) in mockPeople">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editHandle">确定修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TableComponents from '../components/Tables/dg-table'
import { clientSearch, deleteSearch,importCustomer,exportCustomer, updateSearch, updateAccendant } from '../../../api/clientManage/client'
import { searchType } from '../../../api/baseApi'// 这接口也可以搜索业务小哥
import comControl from './control.vue'//控制器
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
      area: [],
      columnData: [],
      selectRow: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 220,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            console.log('first', row)
          },
          deleteOrder: this.deleteOrder,
          upLoadOrder: () => {}
        }
      },
      filterParam: {},
      totalPage: 0,
      radio: 0,
      dialogVisible: false,
      mockPeople: mockPeople
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
        config.width = item.width ? item.width : '120'
        comConfig.filterKey = item.key

        if (item.name === '业务类型') {
          // comConfig.component = selectFilter // 自定义
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
    getselect(val) {
      this.selectRow = val
      console.log(val, '单选广播事件')
    },
    //设置表格样式
    headerCss() {
      return 'font-size:16px; font-weight: 800;'
    },
    //表行点击
    clickRow(row) {
      console.log('', '点击了')
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
    // 删除订单
    deleteOrder(row) {
      console.log(row)
      deleteSearch({ id: row.id }).then((res) => {
        if (res.code == 200) {
          this.tableData.splice(this.tableData.indexOf(row), 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    editHandle() {
      let row = []
      this.selectRow.forEach((item, index) => {
        row.push(item.id)
      })

      let data = {
        id: row,
        accendant: null,
        accendant_id: this.radio
      }
      this.mockPeople.forEach((item) => {
        if (item.id == this.radio) {
          data.accendant = item.name
        }
      })

      updateAccendant(data).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = false
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
        }
      })
    },
    changePeople() {
      if (this.selectRow.length >= 1) {
        this.dialogVisible = true
        return
      }
      return this.$message({
        message: '请选择客户信息,再修改维护人!'
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
    name: '业务类型',
    key: 'business',
    type: 'selectFilter'
  },
  {
    name: '经营范围',
    key: 'business_scope',
    type: 'editFilter'
  },
  {
    name: '公司名称',
    key: 'company',
    type: 'editFilter'
  },
  {
    name: '省份',
    key: 'province_name',
    type: 'selectFilter'
  },
  {
    name: '公司地址',
    key: 'address',
    type: 'editFilter'
  },
  {
    name: '职务',
    key: 'position',
    type: 'editFilter'
  },
  {
    name: '姓名',
    key: 'username',
    type: 'editFilter'

  },
  {
    name: '性别',
    key: 'sex',
    type: 'selectFilter'
  },
  {
    name: '手机号',
    key: 'mobile',
    type: 'editFilter'
  },
  {
    name: '订单数量',
    key: 'order_num',
    type: 'editFilter'

  },
  {
    name: '客户类型',
    key: 'type',
    type: 'selectFilter'
  },
  {
    name: '是否审核',
    key: 'audit_status',
    type: 'selectFilter'
  },
  {
    name: '审核人',
    key: 'audit_username',
    type: 'editFilter'
  },
  {
    name: '创建人',
    key: 'create_username',
    type: 'editFilter'
  },
  {
    name: '维护人',
    key: 'accendant',
    type: 'editFilter'
  },
  {
    name: '最后操作时间',
    key: 'updated_at',
    isNeed: false
  },
  {
    name: '备注',
    key: 'remarks',
    isNeed: false
  }
]
var defParams = {
  query: '',// 搜索字段
  start: 1,
  length: 10,// 条数
  business: '',// 业务类型
  business_scope: '',// 经营范围
  audit_username: '',//昵称
  audit_status: '',//0未审核，1已审核
  company: '',//公司名称
  address: '',//公司地址
  position: '',//职位
  sex: '',//性别
  province: '',//省Id
  mobile: '',//客户手机
  wechat: '',//w微信
  qq: '',// qq
  id_card: '',// 身份证
  telephone: '',//客户固定电话
  fax_number: '',// 传真号
  type: '',//客户类型
  create_user: '',// 创建人姓名
  accendant: '',//业务
  updated_at_from: '',//开始时间
  updated_at_to: '',//结束时间
  order_num: ''//关联数量

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
