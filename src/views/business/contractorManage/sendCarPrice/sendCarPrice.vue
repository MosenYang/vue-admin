<template>
  <div class="page">
    <div class="page-title flex-between">
      <span>提送报价信息</span>
      <el-button type="primary" icon="el-icon-plus" @click="addSendCarPrice">
        添加提送报价
      </el-button>
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
            <el-input
              v-model="defParams.query"
              placeholder="请写查询内容"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleSearch"/>
            <el-button @click="handleSearch"
                       class="filter-item"
                       type="primary"
                       icon="el-icon-search">
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
          <el-button class="filter-item" type="primary" icon="el-icon-download">
            下载导入模板
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-main">
      <table-components :table-data="tableData" :selection="false"
                        :pagination="true"
                        :row-click="clickRow"
                        :action-config="actionConfig"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter"
                        :headerCellStyle="headerCss"
                        @page-change="pageChange"/>
    </div>
  </div>
</template>
<script>
import tableComponents from '../../components/Tables/dg-table2'
import {
  sendCarPriceList,
  deleteCarPrice,
  templateDownLoad,
  templateImport,
  templateExport
} from '../../../../api/contractorManage/sendCarPrice'
import { searchType } from '../../../../api/baseApi'// 这接口搜索业务小哥
import comControl from './control.vue'//控制器
// 自定义表格配置
export default {
  components: { tableComponents },
  props: {},
  data() {
    return {
      defParams: defParams,
      option: option,
      tableData: [],
      columnData: [],
      actionConfig: {
        type: 'customize',
        label: '操作区',
        width: 230,
        fixed: true,
        component: comControl,
        handlers: {
          editOrder: (row) => {
            this.$router.push({ path: '/addSendCarPrice', query: row })
          },
          deleteOrder: this.deleteOrder
        }
      },
      filterParam: {},
      total: 0,
      query: ''
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
        totalPageNum: this.total,
        curPage: this.defParams.start
      }
    }
  },
  watch: {},
  created() {
    this.getTableList()
  },
  mounted() {
    this.mapTableTh()
  },
  methods: {
    getTableList() {
      let params = { ...this.defParams }
      sendCarPriceList(params).then((res) => {
        let { info, total } = res.data
        this.total = total
        this.tableData = info
        console.log(res.data)
      })
    },
    mapTableTh() {
      console.log(initThData.length, '订单总表表格列数')
      initThData.forEach((item, index) => {
        let config = { ...tableConfig }
        let comConfig = { ...tableConfig.filterConfig }
        config.prop = item.key // 数据字段
        config.thIndex = index
        config.isNeed = item.isNeed == false ? false : true
        config.label = comConfig.label = item.name
        config.width = item.width ? item.width : '140'
        comConfig.filterKey = item.key
        comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        config.type = comConfig.type = item.type

        if (item.name === '黑名单') {
          let list = [
            { name: '是', key: 1 },
            { name: '否', key: 2 }
          ]
          comConfig.comData = list
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    //去添加客户
    addSendCarPrice() {
      this.$router.push({ path: '/addSendCarPrice' })
    },
    //改变显示数
    changePageLimit(val) {
      this.getTableList()
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
      console.log(val, '过滤参数')
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
      let param = Object.assign(this.defParams, this.filterParam, { start: 1, query: null })
      this.getTableList(param)
      this.isReaetParam = true//  直接重置需求.没开发
    },
    // 查询
    handleSearch() {
      if (!this.defParams.query) {
        return this.$message({
          type: 'warning',
          message: '请输入查询条件'
        })
      }
      if (this.defParams.query === this.query) {
        return this.$message({
          type: 'warning',
          message: '请输入新的条件'
        })
      } else {
        if (this.defParams.query) this.getTableList()
        this.defParams.query = this.query
      }
    },
    // 删除订单
    deleteOrder(row) {
      console.log(row, '删除行')
      deleteCarPrice({ id: row.id }).then((res) => {
        if (res.code == 200) {
          this.tableData.splice(this.tableData.indexOf(row), 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
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
  company: '',//公司
  mobile: '',
  quotation_user: '',//报价人
  start_address: '',// 地址
  create_user: '',// 创建人
  created_at_from: '',//创建时间
  created_at_to: '',//创建时间止
  updated_at_from: '',//
  updated_at_to: ''//
}
var initThData = [
  {
    name: '公司名称',
    key: 'company',
    type: 'editFilter'
  },
  {
    name: '姓名',
    key: 'quotation_user',
    type: 'editFilter',
    width: 150
  },
  {
    name: '手机',
    key: 'mobile',
    type: 'editFilter'
  },
  {
    name: '提送区域',
    key: 'start_address',
    type: 'editFilter'
  },
  {
    name: '同行价',
    key: 'peer_price',
    type: 'editFilter'
  },
  {
    name: '汽贸价',
    key: 'clients_price',
    type: 'editFilter'
  },
  {
    name: '网络价',
    key: 'network_price',
    type: 'editFilter',
    width: 150
  },
  {
    name: '维护人',
    key: 'create_user',
    type: 'editFilter',
    width: 150
  },
  {
    name: '更新时间',
    key: 'updated_at',
    isNeed: false
  },
  {
    name: '创建时间',
    key: 'created_at',
    isNeed: false
  },
  {
    name: '备注',// 没有字段
    key: 'remarks',
    paramKey: null,
    isNeed: false
  }
]
var tableConfig = {
  prop: '', // 参数字段
  label: '', // 名字
  type: '', // 类型当前表头交互类型
  hidden: false,//当前数据多.是否需要渲染
  isNeed: true,// 是否需要搜索项
  thIndex: null,
  component: null,// 表格Td 内部组件可以传
  componentConfig: null,// 表格Td 配置项
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

  .table-main {
    padding: 0 j(20);
  }
</style>
