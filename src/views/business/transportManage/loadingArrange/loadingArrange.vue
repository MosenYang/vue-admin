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
      length: '',
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
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getTableList() {},
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
    key: '',
    type: 'editFilter'

  },
  {
    name: '发站',
    key: '',
    type: 'editFilter'

  },
  {
    name: '到站',
    key: '',
    type: 'editFilter'
  },
  {
    name: '托运人',
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
    name: '单价',
    key: ''
  },
  {
    name: '经办人',
    key: '',
    type: 'editFilter'

  },
  {
    name: '业务类别',
    key: '',
    type: 'selectFilter'
  },
  {
    name: '中转地',
    key: ''
  },
  {
    name: '运费结算方式',
    key: ''
  },
  {
    name: '运费',
    key: ''
  },
  {
    name: '运费修改人',
    key: '',
    type: 'editFilter'
  },
  {
    name: '运费修改时间',
    key: '',
    type: 'editFilter'
  },
  {
    name: '备注',
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
