<!--提送信息-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="报价信息"/>
      <div class=""></div>
    </div>
    <div class="totalTable-container">
      <div class="control">
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>出发地:</span>
            <el-input v-model="defParams.start_province"
                      placeholder="请写出发地"
                      style="width: 200px;"
                      class="filter-item"
                      @keyup.enter.native="handleSearch"/>
          </div>
          <div class="inquire-wrap">
            <span>到达地:</span>
            <el-input v-model="defParams.end_province"
                      placeholder="请写到达地"
                      style="width: 200px;"
                      class="filter-item"
                      @keyup.enter.native="handleSearch"/>
          </div>
          <el-button class="filter-item" @click="handleSearch" type="primary">
            <i class="el-icon-refresh"></i>
            查询
          </el-button>
          <el-button class="filter-item" type="primary">
            <i class="el-icon-upload" style=""></i>
            重置
          </el-button>
        </div>
      </div>
    </div>
    <div>
      <h4>运输报价:</h4>
      <table-components :table-data="transport"
                        :selection="false"
                        :pagination="false"
                        :row-click="onClickHandle"
                        :action-config="{}"
                        :page-config="pageData"
                        :column-config="columnData"
                        @filter-change="getFilter">
      </table-components>
    </div>
  </div>
</template>
<script>
import tableComponents from '../../components/Tables/dg-table2'
import { getPrice } from '../../../../api/business/businessOrder/offerInfo'

export default {
  components: { tableComponents },
  props: {},
  data() {
    return {
      query: '',
      defParams: defParams,
      tableData: [],
      columnData: [],
      filterParam: {},
      total: 0,
      transport: [],
      lift_car: [],
      car_delivery: [],
      pageData: {
        totalPageNum: 100,
        curPage: 1
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getTableList()
  },
  mounted() {
  },
  methods: {
    getTableList() {
      let { start_province, end_province } = this.defParams
      if (start_province && end_province) {
        getPrice(this.defParams).then((res) => {
          if (res.code == 200) {
            console.log('r', res.data)
            let { transport, lift_car, car_delivery } = res.data
            this.transport = transport
            this.lift_car = lift_car
            this.car_delivery = car_delivery
            this.mapTableTh()
          }
        })
      }
    },
    mapTableTh() {
      console.log(this.initTHData, '订单总表表格列数')
      this.columnData = []
      this.initTHData.forEach((item, index) => {
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
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
      console.log(this.columnData, '表头数据')
    },
    handleSearch() {},
    onClickHandle() {},
    getFilter() {}
  }
}

var initThData2 = [
  {
    name: '公司名称',
    key: 'company',
    type: 'editFilter'
  },
  {
    name: '提车地区',
    key: 'start_address'
  },
  {
    name: '汽贸价',
    key: 'start_province'
  },
  {
    name: '同行价',
    key: 'end_address'
  },
  {
    name: '网络价',
    key: 'end_province'
  },
  {
    name: '更新日期',
    key: 'clients_price'
  }
]
var initThData3 = [
  {
    name: '公司名称',
    key: 'company',
    type: 'editFilter'
  },
  {
    name: '提车地区',
    key: 'start_address'
  },
  {
    name: '汽贸价',
    key: 'start_province'
  },
  {
    name: '同行价',
    key: 'end_address'
  },
  {
    name: '网络价',
    key: 'end_province'
  },
  {
    name: '更新日期',
    key: 'clients_price'
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
var defParams = {
  start_province: '山西',
  end_province: '北京'
}
var initThData = [
  {
    name: '公司名称',
    key: 'company',
    type: 'editFilter'
  },
  {
    name: '出发地',
    key: 'start_address'
  },
  {
    name: '出发归属地',
    key: 'start_province',
    type: 'editFilter'
  },
  {
    name: '到达地',
    key: 'end_address'
  },
  {
    name: '到达归属地',
    key: 'end_province',
    type: 'selectFilter'
  },
  {
    name: '汽贸',
    key: 'clients_price'
  },
  {
    name: '同行',
    key: 'peer_price'
  },
  {
    name: '网络',
    key: 'network_price'
  },
  {
    name: '更新日期',
    key: 'updated_at'
  },
  {
    name: '备注',
    key: 'remarks'
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
        @extend %start;
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
