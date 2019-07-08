<template>
  <div>
    <div class="filterbox">
      <!--筛选项内容区-->
      <div v-if="barData" class="filter-with-count">
        <el-tag v-for="(item, i) in barData" :key="i"
                disable-transitions
                closable
                style="margin-right:10px;"
                size="small"
                type="info"
                @close="handleClose($event,item)">
          <span v-if="item.value" style="color:#bbb">{{ item.label }}:</span>{{ item.value }}
        </el-tag>
      </div>
    </div>
    <div v-if="tableData" style="position:relative">
      <el-table ref="elTable" fit border v-loading="isLoading"
                :data="tableData"
                :show-summary="summary"
                @row-click="rowClick"
                :header-cell-style="headerCellStyle"
                @selection-change="handleSelectChange">
        <!--多选 -->
        <el-table-column v-if="selection" type="selection" width="35"/>
        <!--循环项-->
        <template v-for="(item,idx) in columnConfig">
          <!--1.表格自定义-->
          <el-table-column v-if="item.tdComponent" :key="idx"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :align="item.align"
                           :resizable="item.resizable"
                           :header-align="item.headerAlign"
                           :show-overflow-tooltip="item.showOverflowTooltip">
            <!-- 自定义头部 新写法-->
            <template slot="header" slot-scope="scope">
              <el-popover placement="bottom"
                          @show="curId=idx"
                          @hide="curId=-1"
                          trigger="hover"
                          :disabled="item.isNeed?false:true">
                <component v-if="item.filterConfig && item.isNeed"
                           :is="item.filterConfig.component"
                           :paramKey="item.filterConfig.paramKey"
                           :filterKey="item.filterConfig.filterKey"
                           :listInfo="item.filterConfig.listInfo"
                           :comData="item.filterConfig.comData"
                           :comProps="item.filterConfig.comProps"
                           :placeholder="item.filterConfig.placeholder"
                           :label='item.filterConfig.label'
                           :type='item.filterConfig.type'
                           @getFilterBridge="getFilterBridge"/>
                <div slot="reference">
                  <span>{{item.label}}</span>
                  <i :style="{color:curId==idx?'blue':''}"
                     :class="curId==idx?'el-icon-caret-top':'el-icon-caret-bottom'"
                     v-if="item.isNeed"></i>
                </div>
              </el-popover>
            </template>
            <!--td内容 在使用v-if控制自定义组件失效,所以使用本办法-->
            <template slot-scope="scope" v-if='item.tdComponent'>
              <component :is="item.tdComponent"
                         :row="scope.row"
                         :tdParam="item.paramKey ? item.paramKey : item.prop"
                         :tdValue="scope.row[item.prop]"
                         :tdConfig="item.tdConfig"></component>
            </template>
          </el-table-column>

          <!--2.表格默认-->
          <el-table-column v-else :key="idx"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :align="item.align"
                           :resizable="item.resizable"
                           :header-align="item.headerAlign"
                           :show-overflow-tooltip="item.showOverflowTooltip">
            <!-- 自定义头部 新写法-->
            <template slot="header" slot-scope="scope">
              <el-popover placement="bottom"
                          @show="curId=idx"
                          @hide="curId=-1"
                          trigger="hover"
                          :disabled="item.isNeed?false:true">
                <component v-if="item.filterConfig && item.isNeed"
                           :is="item.filterConfig.component"
                           :paramKey="item.filterConfig.paramKey"
                           :filterKey="item.filterConfig.filterKey"
                           :listInfo="item.filterConfig.listInfo"
                           :comData="item.filterConfig.comData"
                           :comProps="item.filterConfig.comProps"
                           :placeholder="item.filterConfig.placeholder"
                           :label='item.filterConfig.label'
                           :type='item.filterConfig.type'
                           @getFilterBridge="getFilterBridge"/>
                <div slot="reference">
                  <span>{{item.label}}</span>
                  <i :style="{color:curId==idx?'blue':''}"
                     :class="curId==idx?'el-icon-caret-top':'el-icon-caret-bottom'"
                     v-if="item.isNeed"></i>
                </div>
              </el-popover>
            </template>
            <!--td内容 在使用v-if控制自定义组件失效-->
            <!--<template></template>-->
          </el-table-column>
        </template>
        <!--操控按钮栏目-->
        <template v-if="actionConfig">
          <el-table-column v-if="actionConfig.component"
                           :width="actionConfig.width||120"
                           :label="actionConfig.label"
                           :fixed="actionConfig.fixed"
                           align="center">
            <template slot-scope="scope">
              <component :is="actionConfig.component" :row="scope.row" :handlers="actionConfig.handlers"/>
              <!--  row 是当前行, handlers 是初始配置的方法传的 -->
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!--  分页器区域-->
    <div v-if="pagination" class="paginationWrap">
      <el-pagination background
                     :pager-count="7"
                     layout="prev, pager, next"
                     :page-count="pageConfig.totalPageNum"
                     :current-page.sync="pageConfig.curPage"
                     @current-change="clickPage"/>
    </div>
  </div>
</template>
<script>
import editFilter from './defFilter/edit.vue'
import searchSelectFilter from './defFilter/searchSelect.vue'
import selectFilter from './defFilter/selectFilter.vue'
import dateFilter from './defFilter/dateFilter.vue'

// 默认筛选器组件
var defComponents = {
  editFilter, // 输入框选择器
  searchSelectFilter,// 自动搜索
  selectFilter,//纯下拉
  dateFilter//日期
}
// 默认筛选器字段
const ComFilterDefConfig = {
  comData: [],
  label: '',
  userSetData: [],
  dataItems: [],
  comProps: {},
  filterKey: '',
  listInfo: {},
  placeholder: '',
  unit: '',
  ftn: '',
  hideBg: false
}
var _filterAction = {} // 动作状态对象 radio_gender: true
var _curFilter = '' // 当前元素
var _filterbar = null // 点击元素的父元素
export default {
  name: 'DgTable',
  props: {
    names: {
      type: String,
      default: ''
    },
    columnConfig: {//栏数据
      type: Array,
      default: function() {
        return []
      }
    },
    tableData: {// 表格数据
      type: Array,
      default: function() {
        return []
      }
    },
    selection: {// 多选项开关
      type: Boolean,
      default: false
    },
    pagination: { // 分页器开关
      type: Boolean,
      default: true
    },
    pageConfig: { // 分页器配置
      type: Object,
      default: function() {
        return {
          totalPageNum: 10,
          curPage: 1
        }
      }
    },
    rowClick: { // 行点击事件
      type: Function,
      default: function() {
        return () => {}
      }
    },
    summary: {// 首位合计行 开关
      type: Boolean,
      default: false
    },
    // 操作栏对象
    actionConfig: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // element自带显示加载
    isLoading: {
      type: Boolean,
      default: false
    },
    tableRowClassName: {
      type: Function,
      default: () => {}
    },
    headerCellStyle: {
      type: Function,
      default: ({ row, column, rowIndex, columnIndex }) => {
        return 'fontWeight:600'
      }
    },
    // 父组件清空所有筛选项
    isClear: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      barData: [],
      regFilters: {}, // 所有的组件对象
      filterAction: {},// 动态显示  radio_gender: true
      emitParams: {},// 过滤参数
      curId: -1
    }
  },
  computed: {},
  watch: {
    isClear(newValue, oldValue) {
      if (newValue !== 0) {
        this.barData = []
        for (let i in this.emitParams) {
          this.emitParams[i] = ''
        }
      }
    },
    columnConfig(newValue) {
      if (newValue) {
        this.columnConfig.forEach((item) => {
          if (item.filterConfig) {
            this.doRegFilters(item.filterConfig.type, item)
          }
        })
      }
    }
  },
  mounted: function() {
    this.columnConfig.forEach((item) => {
      if (item.filterConfig) {
        this.doRegFilters(item.filterConfig.type, item)
      }
    })

    window.onresize = () => {
      setTimeout(() => {
        if (_filterbar) this.filterPosition(_filterbar, _curFilter)
      }, 1)
    }
  },
  destroyed() {
    _filterAction = {}// 状态对象
    _filterbar = null// 父级
  },
  methods: {
    clickPage(val) {
      this.$emit('page-change', val)
    },
    resetFilter() {},
    //关闭搜索项
    handleClose(tag, item) {
      this.barData.splice(this.barData.indexOf(tag), 1)
      this.emitParams[item.paramKey] = null || ''
      this.$emit('filter-change', this.emitParams)
    },
    // 广播事件(复用)
    getFilterBridge(valObj) {// valObj.value 可能是对象 || 字符
      console.log(valObj, '传上来的筛选数据~!')
      let isObj = Object.prototype.toString.call(valObj.value) === '[object Object]'
      let option = {
        label: valObj.label,
        value: valObj.value.name ? valObj.value.name : valObj.value,
        filterKey: valObj.filterKey,
        paramKey: valObj.paramKey ? valObj.paramKey : valObj.filterKey
      }
      this.barData.forEach((item, index, array) => {
        if (item.label === valObj.label) {
          this.barData.splice(this.barData.indexOf(item), 1)
        }
        return array
      })
      // 给参数赋值: 接口需要的值 或者文字,或者数字
      this.emitParams[option.paramKey] = valObj.value.id || valObj.value
      this.barData.push(option)
      this.$emit('filter-change', this.emitParams)
    },

    // 循环方法
    doRegFilters(ftype, columconfig) {
      let filterTag = `${ftype}_${columconfig.prop}`
      if (!defComponents[ftype]) {
        if (columconfig.filterConfig.component) {
          let newFilter = { [ftype]: columconfig.filterConfig.component }
          defComponents = Object.assign({}, defComponents, newFilter)
        }
      } else {
        columconfig.filterConfig.component = defComponents[ftype]
      }
      if (!columconfig.filterConfig) return
      const config = {
        show: false,
        refName: filterTag,// 类型加上字段
        position: { top: 0, left: 0 }
      }
      let filterConfig = Object.assign(config, ComFilterDefConfig, columconfig.filterConfig)
      this.$set(this.regFilters, filterTag, filterConfig) // 把所有的表头都添加上,循环
      this.filterAction = JSON.parse(JSON.stringify(_filterAction))
      return filterTag
    },
    // 表头点击事件
    headerClick(e, item) {
      if (!item.isNeed) return
      e.cancelBubble = true
      const curElId = e.currentTarget.id
      const curParentElId = e.currentTarget.parentElement.parentElement
      if (_filterAction[curElId]) {
        document.querySelector(`#${curElId} i`).setAttribute('class', 'el-icon-caret-bottom')
      } else {
        document.querySelector(`#${curElId} i`).setAttribute('class', 'el-icon-caret-top')
      }

      this.allFilterHide(curElId)
      this.filterPosition(curParentElId, curElId)
      this.$set(_filterAction, curElId, !_filterAction[curElId])
      this.filterAction = _filterAction// 动作对象
      _filterbar = curParentElId
    },
    filterPosition(filterbar, filtertag) {
      var offsetLeft = filterbar.offsetLeft
      var offsetHeight = filterbar.offsetHeight
      let l = filterbar.getBoundingClientRect().left
      let h = filterbar.getBoundingClientRect().top

      if (this.regFilters[filtertag]) {
        this.$set(this.regFilters[filtertag].position, 'top', offsetHeight - 10 + 'px')
        this.$set(this.regFilters[filtertag].position, 'left', offsetLeft + 'px')
      }
    },
    allFilterHide(cfilter) {
      for (var k in _filterAction) {
        if (k !== cfilter) {
          this.$set(_filterAction, k, false)
          if (document.querySelector(`#${k} i`)) {
            document.querySelector(`#${k} i`).setAttribute('class', 'el-icon-caret-bottom')
          }
        }
      }
      this.filterAction = _filterAction
    },
    // 单选或者多选事件
    handleSelectChange(val) {
      this.$emit('select-change', val)
    }
  },
  directives: {
    clickOutSide: {
      bind: function(el, binding) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false
          }
          if (binding.expression) {
            binding.value(e)
          }
        }

        el.__vueClickOutside__ = documentHandler
        document.addEventListener('click', documentHandler)
      },
      unbind: function(el) {
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  }
  //end
}
// 标准的入参 循环数据的基本格式,字段务必正确
var tableConfig = {
  prop: '', // 参数字段
  label: '', // 名字
  type: '', // 类型当前表头交互类型
  paramKey: '',// 对应列的接口参数,(有相同也有不同)
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

</script>
<style scoped>
  .filterbox {
    height: 50px;
    display: flex;
    padding: 0 10px;
    align-items: center;
    background: #f9f9f9;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    justify-content: space-between;
  }

  .paginationWrap {
    display: flex;
    justify-content: center;
    margin-top: 20px
  }

  .filter-with-count {
    display: flex;
    align-items: center;
  }

  .count {
    color: #909399;
    font-size: 12px;
  }
</style>
