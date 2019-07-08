<!--车辆信息-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="车辆信息"/>
      <div class="">
        <el-button @click="goAddCar">添加车辆</el-button>
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
            <el-button v-waves @click="handleSearch" class="filter-item" type="primary" icon="el-icon-search">
              查询
            </el-button>
          </div>
          <el-button v-waves class="filter-item" type="primary">
            <i class="el-icon-refresh"></i>
            重置
          </el-button>
        </div>
      </div>
    </div>
    <div>
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
  </div>
</template>
<script>
import tableComponents from '../../../components/Tables/dg-table2'
import control from './control'
import waves from '@/directive/waves/index.js' // 水波纹指令
import {
  carInfoList,
  checkName,
  addNewCar,
  deleteCar,
  editNewCar,
  exportCar,
  uoLoadFile,
  deleteFile
} from '../../../api/carList/carManage/carManage'

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
        width: 220,
        fixed: true,
        component: control,
        handlers: {
          changeTransport(row) {},
          addTransportAar(row) {},
          createFile(row) {},
          uploadFile(row) {}
        }
      },
      filterParam: {},
      totalPage: 0,
      isClear: 0
    }
  },
  computed: {

    pageData() {
      return {
        totalPageNum: this.totalPage,
        curPage: this.defParams.start
      }
    },
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
  async created() {
    await this.getTableList()
    this.mapTableTh()
  },
  mounted() {
    checkName().then((res) => {})
  },
  methods: {
    goAddCar() {
      this.$router.push({ name: 'addCarInfo' })
    },
    getTableList(params) {
      let data = params ? params : this.defParams
      carInfoList(data).then((res) => {
        this.info = res.data
        console.log('res.data', res.data)
        let { info, total } = res.data
        this.tableData = info
        this.totalPage = total
      })
    },
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
        config.width = item.width ? item.width : '130'
        comConfig.filterKey = item.key
        config.paramKey = comConfig.paramKey = item.paramKey ? item.paramKey : item.key
        if (item.key === 'now_status') {
          comConfig.comData = this.car_status
        }
        if (item.name === '是否有中转订单' || item.name === '是否更新在途') {
          comConfig.comData = [{ name: '是', value: 1 }, { name: '否', value: 0 }]
        }
        if (item.name.indexOf('日期') !== -1) {
          config.width = 260
        }
        config.filterConfig = comConfig
        this.columnData.push(config)
      })
    },
    changePageLimit(val) {
      this.getTableList()
    },
    handleReset() {
      let i = Math.floor(Math.random() * 10 + 1)
      this.isClear = i
      for (let key in this.filterParam) {
        this.filterParam[key] = ''
      }
      console.log('重置', this.filterParam)
      let param = Object.assign(this.defParams, this.filterParam, { start: 1 })
      this.getTableList(param)
    },
    //* 搜索
    handleSearch() {
      if (this.defParams.global_query) {
        this.defParams.start = 1
        this.getTableList(this.defParams)
      } else {
        this.$message({
          showClose: true,
          message: '请输入查询内容',
          type: 'warning'
        })
      }
    },
    getFilter(val) {
      if (val.dispose_time && val.dispose_time !== '') {//操作时间
        this.defParams.dispose_time_start = val.dispose_time[0]
        this.defParams.dispose_time_end = val.dispose_time[1]
      } else {
        this.defParams.audit_time_start = ''
        this.defParams.audit_time_end = ''
      }
      if (val.create_order_time && val.create_order_time !== '') {// 开单日期
        this.defParams.create_order_time_start = val.create_order_time[0]
        this.defParams.create_order_time_end = val.create_order_time[1]
      } else {
        this.defParams.create_order_time_start = ''
        this.defParams.create_order_time_end = ''
      }
      let param = Object.assign(this.defParams, val, { start: 1 })
      this.filterParam = { ...val }
      this.getTableList(param)
      console.log(val, '当前参数')
      console.log(param, '请求参数')
    },
    headerCss() {return 'font-size:16px; font-weight: 800;'},
    getSelect(row) {
      this.selectRow = row
      console.log('this.selectRow', this.selectRow)
    },
    pageChange(val) {
      this.defParams.start = val
      this.getTableList(this.defParams)
    },
    upload() {}
  },
  directives: { waves }
}

var initThData = [
  {
    name: '车牌号',
    key: 'license_plate_number',
    type: 'editFilter'
  },
  {
    name: '司机姓名',
    key: 'driver_name',
    type: 'editFilter'
  },
  {
    name: '司机电话',
    key: 'mobile',
    type: 'editFilter'
  },
  {
    name: '车架号',
    key: 'car_top_vin',
    type: 'editFilter'
  },
  {
    name: '发动机号',
    key: 'engine_no',
    type: 'editFilter'
  },
  {
    name: '车头行驶证年检日期',
    key: 'headstock_annual_date',
    type: 'dateFilter'
  },
  {
    name: '车头运营证年检日期',
    key: 'headstock_operation_certificate_date',
    type: 'dateFilter',
    width: '190'
  },
  {
    name: '保险类型1',
    key: 'headstock_insurance_type_one',
    type: 'editFilter',
    width: '170'
  },
  {
    name: '保险类型2',
    key: 'headstock_insurance_type_one',
    type: 'editFilter',
    width: '170'
  },
  {
    name: '保险公司1',
    key: 'car_top_insurance_company',
    type: 'editFilter'
  },
  {
    name: '保险公司2',
    key: 'headstock_insurance_company_two',
    type: 'editFilter'
  },
  {
    name: '单号1',
    key: 'headstock_odd_numbers_one',
    type: 'editFilter'
  },
  {
    name: '单号2',
    key: 'headstock_odd_numbers_two',
    type: 'editFilter'
  },
  {
    name: '投保确认码1',
    key: 'headstock_insurance_confirmation_code_one',
    type: 'editFilter'
  },
  {
    name: '投保确认码2',
    key: 'headstock_insurance_confirmation_code_two',
    type: 'editFilter'
  },
  {
    name: '保险单号1',
    key: 'headstock_policy_number_one',
    type: 'editFilter',
    width: 180
  },
  {
    name: '保险单号2',
    key: 'headstock_policy_number_two',
    type: 'editFilter',
    width: 180
  },
  {
    name: '保险到期1',
    key: 'headstock_insurance_end_date_one',
    type: 'dateFilter',
    width: 180
  },
  {
    name: '保险到期2',
    key: 'headstock_insurance_end_date_two',
    type: 'dateFilter',
    width: 180
  },
  {
    name: '车挂号',
    key: 'trailer',
    type: 'editFilter'
  },
  {
    name: '车架号',
    key: 'car_hanging_vin',
    type: 'editFilter'
  },
  {
    name: '总质量',
    key: 'total_mass',
    type: 'editFilter'
  },
  {
    name: '车辆出厂日期',
    key: 'date_of_production',
    type: 'dateFilter'
  },
  {
    name: '车辆行驶证年检日期',
    key: 'car_hanging_annual_date',
    type: 'dateFilter'
  },
  {
    name: '车辆运营证年检日期',
    key: 'car_hanging_operation_certificate_date',
    type: 'dateFilter'
  },
  {
    name: '保险类型',
    key: 'car_hanging_insurance_type',
    type: 'editFilter'
  },
  {
    name: '保险公司',
    key: 'car_hanging_insurance_company',
    type: 'editFilter'
  },
  {
    name: '单号',
    key: 'car_hanging_odd_numbers',
    type: 'editFilter'
  },
  {
    name: '投保确认码',
    key: 'car_hanging_insurance_confirmation_code',
    type: 'editFilter'
  },
  {
    name: '保险单号',
    key: 'car_hanging_policy_number',
    type: 'editFilter'
  },
  {
    name: '保险到期',
    key: 'car_hanging_insurance_end_date',
    type: 'dateFilter'
  },
  {
    name: '车辆货物险到期',
    key: 'cargo_insurence_end_date',
    type: 'dateFilter'
  },
  {
    name: '驾驶证年检日期',
    key: 'driving_permits_annual_inspection',
    type: 'dateFilter'
  },
  {
    name: '资格证年检日期',
    key: 'certification_card',
    type: 'dateFilter'
  },
  {
    name: '保额',
    key: 'coverage',
    type: 'editFilter'
  },
  {
    name: '车位数',
    key: 'parking_spaces_num',
    type: 'editFilter'
  },
  {
    name: '车辆状态',
    key: 'car_status',
    type: 'editFilter'
  },
  {
    name: '创建人',
    key: 'creator',
    isNeed: false
  },
  {
    name: '创建时间',
    key: 'created_at',
    isNeed: false
  },
  {
    name: '备注',
    key: 'remarks',
    isNeed: false
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
  query: '',
  length: 10,
  start: 0,
  car_num: '',//车牌号
  driver_name: '',//司机姓名
  mobile: '',// 司机电话
  car_top_vin: '',//车头车架号
  engine_no: '',//发动机号
  headstock_annual_date_from: '',//车头行驶证年检日期开始时间
  headstock_annual_date_to: '',//车头行驶证年检日期结束时间
  headstock_operation_certificate_date_from: '',//车头运营证年检开始日期
  headstock_operation_certificate_date_to: '',//车头运营证年检结束日期
  headstock_insurance_type_one: '',//	保险类型1
  headstock_insurance_type_two: '',//保险类型2,
  headstock_insurance_company: '',//车头保险公司1
  headstock_insurance_company_two: '',//车头保险公司2
  headstock_odd_numbers_one: '',//车头单号1
  headstock_odd_numbers_two: '',//车头单号2
  headstock_insurance_confirmation_code_one: '',//车头确认码1
  headstock_insurance_confirmation_code_two: '',//车头确认码2
  headstock_policy_number_one: '',//保险单号1
  headstock_policy_number_two: '',//保险单号2
  headstock_insurance_end_date_from_one: '',//保险到期开始时间1
  headstock_insurance_end_date_to_one: '',//保险到期结束时间1
  headstock_insurance_end_date_from_two: '',//保险到期开始时间2
  headstock_insurance_end_date_to_two: '',//保险到期结束时间2
  trailer: '',//车挂号
  car_hanging_vin: '',//车架号
  total_mass: '',//总质量
  date_of_production_from: '',//车辆出厂开始日期
  date_of_production_to: '',//车辆出厂结束日期
  car_hanging_annual_date_from: '',//车挂行驶证年检开始日期
  car_hanging_annual_date_to: '',//车挂行驶证年检结束日期
  car_hanging_operation_certificate_date_from: '',//车挂运营证开始日期
  car_hanging_operation_certificate_date_to: '',//	车挂运营证结束日期
  car_hanging_insurance_type: '',//保险类型
  car_hanging_insurance_company: '',//车挂保险公司
  car_hanging_odd_numbers: '',//单号
  car_hanging_insurance_confirmation_code: '',//投保确认码
  car_hanging_policy_number: '',//保险单号
  insurance_end_date_from: '',//车挂保险到期开始时间
  insurance_end_date_to: '',//车挂保险到期结束
  cargo_insurence_end_date_from: '',//货物险到期开始时间
  cargo_insurence_end_date_to: '',//货物险到期结束时间
  driving_permits_annual_inspection_from: '',//驾驶证年检日期开始时间
  driving_permits_annual_inspection_to: '',//驾驶证年检日期结束时间
  certification_card_from: '',//资格证年检日期开始时间
  certification_card_to: '',//资格证年检日期结束时间
  car_status: ''//车辆状态，0无司机，1使用中，2已卖出
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
