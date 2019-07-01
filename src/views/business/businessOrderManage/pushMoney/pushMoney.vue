<!--提送信息-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="业务提成"/>
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
            <el-button @click="handleSearch"
                       class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button class="filter-item"
                     type="primary">
            <i class="el-icon-refresh"></i>
            重置
          </el-button>
          <el-button class="filter-item"
                     type="primary">
            <i class="el-icon-upload" style=""></i>
            导出
          </el-button>
          <el-button class="filter-item"
                     type="primary">
            <i class="el-icon-edit-outline" style=""></i>
            批量审核
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tableComponents from '../../components/Tables/dg-table2'
import waves from '@/directive/waves/index.js' // 水波纹指令
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
    length: {
      get() {
        if (this.defParams.length) return this.defParams.length + '条/页'
      },
      set(val) {
        this.defParams.length = val
      }
    }
  },
  watch: {},
  created() {
    this.getTableList()
  },
  mounted() {},
  methods: {
    getTableList() {
      let a  = initThData
      console.log('000', a)
    },
    handleSearch() {},
    //改变显示数
    changePageLimit(val) {
      this.getTableList()
    },
    getCurrentDate() {
      return new Date().toLocaleDateString()
    }
  },
  directives: { waves }
}

var initThData = [
  {
    name: '订单号',
    key: '',
    type: 'editFilter'

  },
  {
    name: '开单日期',
    key: '',
    type: 'editFilter'

  },
  {
    name: '订单状态',
    key: '',
    type: 'selectFilter'
  },
  {
    name: '提送类型',
    key: '',
    type: 'selectFilter'

  },
  {
    name: '审核状态',
    key: '',
    type: 'selectFilter'
  },
  {
    name: '审核人',
    key: '',
    type: 'editFilter'
  },
  {
    name: '审核时间',
    key: ''
  },
  {
    name: '公司名称',
    key: '',
    type: 'editFilter'

  },
  {
    name: '司机姓名',
    key: '',
    type: 'editFilter'
  },
  {
    name: '司机电话',
    key: '',
    type: 'editFilter'
  },
  {
    name: '车牌号',
    key: '',
    type: 'editFilter'

  },
  {
    name: '提车地址',
    key: '',
    type: 'editFilter'
  },
  {
    name: '到达地址',
    key: '',
    type: 'editFilter'
  },
  {
    name: '托运人',
    key: '',
    type: 'editFilter'
  },
  {
    name: '托运人电话',
    key: '',
    type: 'editFilter'
  },
  {
    name: '收货人',
    key: '',
    type: 'editFilter'
  },
  {
    name: '收货人电话',
    key: '',
    type: 'editFilter'
  },
  {
    name: '货物名称',
    key: '',
    type: 'editFilter'
  },
  {
    name: '识别码',
    key: '',
    type: 'editFilter'
  },
  {
    name: '付款方式',
    key: '',
    type: 'selectFilter'
  },
  {
    name: '金额',
    key: '',
    type: 'editFilter'
  },
  {
    name: '代收款',
    key: ''
  },
  {
    name: '提送时间',
    key: '',
    type: 'editFilter'
  },
  {
    name: '经办人',
    key: '',
    type: 'editFilter'
  },
  {
    name: '回单',
    key: '',
    type: 'selectFilter'
  },
  {
    name: '提车备注',
    key: ''
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
  company: '',//公司
  type: '',//公司类别 transport:运输商；tisong:提送
  name: '',// 姓名
  position: '',//职位
  sex: '',//性别
  mobile: '',//客户手机
  telephone: '',//电话
  company_address: '',
  business_scope: '',// 经营范围
  start_address: '',
  end_address: '',
  wechat: '',//微信
  qq: '',// qq
  fax: '',//传真号
  create_user_name: '',//创建人
  created_at_from: '',// 创建时间
  created_at_to: '',//创建时间截止
  updated_at_from: '',//更新时间起
  updated_at_to: ''//更新时间截止
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
