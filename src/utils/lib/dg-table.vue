<template>
  <div>
    <div class="filterbox">
      <!--筛选项内容区-->
      <div v-if="bardata" class="filter-with-count">
        <el-tag
          v-for="(item, index) in bardata"
          :key="index"
          disable-transitions
          closable
          style="margin-right:10px;"
          size="small"
          type="info"
          @close="handleClose(item)"
        >
          <span v-if="item.ftn" style="color:#bbb">{{ item.ftn }}:</span>{{ item.label }}
        </el-tag>
        <div class="count">
          <slot name="tip">
            <b>
              <slot name="count" />
            </b>
          </slot>
        </div>
        <div class="count">
          <slot name="curnum">
            <b>
              <slot name="curcount" />
            </b>
          </slot>
        </div>
        <div class="count">
          <slot name="selectnum">
            <b>
              <slot name="selectcount" />
            </b>
          </slot>
        </div>
      </div>
      <div>
        <slot />
      </div>
    </div>
    <div v-if="tableData" style="position:relative">
      <el-table
        ref="eltable"
        v-loading="isLoading"
        :data="tableData"
        style="width: 100%"
        :show-summary="summary"
        @row-click="rowClick"
        @selection-change="handleSelectChange"
      >
        <!-- @selection-change="handleSelectChange" 单选事件-->
        <!--  element 自带 show-summary字段 是否在表尾显示合计行-->
        <el-table-column
          v-if="selection"
          type="selection"
          width="35"
        />
        <!--循环的-->
        <template v-for="(item, index) in columnConfig">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
            <template slot="header" slot-scope="scope">
              <template v-if="item.filterConfig && item.filterConfig.type">
                <!-- 表格头部-->
                <span
                  :id="`${item.filterConfig.type}_${item.prop}`"
                  class="customize_filter"
                  style="cursor:pointer;display:inline-block"
                  @click="headerClick"
                >
                  <span style="padding-right:3px;">{{ item.label }}</span>
                  <!--上下箭头-->
                  <i class="el-icon-caret-bottom" />
                </span>
              </template>
              <template v-else>
                <!--不显示箭头-->
                <span class="customize_filter" style="display:inline-block">
                  <span style="padding-right:3px;">{{ item.label }}</span>
                </span>
              </template>
            </template>
            <!--            -->
            <template slot-scope="{ row }">
              <!--传数据的时候  component 和  processCallback 和 style 是平级的 -->
              <template v-if="!item.component">
                <!-- 默认提供了时间转化列，获取数组数量列，数据映射列，提供以点的形式来获取对象数据，为空时返回 ‘-’ -->
                <span v-if="item.processCallback === 'time'" :style="item.style ? item.style : ''">
                  {{ getTime(row[item.prop]) }}
                </span>
                <span v-else-if="item.processCallback === 'time2'" :style="item.style ? item.style : ''">
                  {{ getTime(row[item.prop], 'y-m-d h:s:m') }}
                </span>
                <span v-else-if="typeof item.processCallback === 'function'" :style="item.style ? item.style : ''">
                  {{ item.processCallback(row, item.prop) }}
                </span>
                <span v-else :style="item.style">
                  {{ getText({cc: item, s: row}) }}
                </span>
              </template>
              <!-- 自定义组件来处理列的数据 -->
              <template v-if="item.component">
                <component
                  :is="item.component"
                  :key="index"
                  :row="row"
                  :extra="item.extra"
                />
              </template>
            </template>
          </el-table-column>
        </template>
        <!--操控按钮栏目-->
        <template v-if="actionConfig">
          <!-- 单个按钮 -->
          <el-table-column v-if="actionConfig.type === 'button'" :width="actionConfig.width" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click.stop="actionConfig.handler(scope)">
                {{ actionConfig.label }}
              </el-button>
            </template>
          </el-table-column>
          <!-- 传个文字 -->
          <el-table-column
            v-if="actionConfig.type === 'textbtn'"
            :width="actionConfig.width"
            label="操作"
          >
            <template slot-scope="scope">
              <span style="cursor:pointer;color: #ff0000;" @click.stop="actionConfig.handler(scope)">
                {{ actionConfig.label }}
              </span>
            </template>
          </el-table-column>
          <!-- 自定义操作 传组件 type === 'customize' -->
          <el-table-column
            v-if="actionConfig.type === 'customize' && actionConfig.component"
            :width="actionConfig.width"
            :label="actionConfig.label ? actionConfig.label : '操作'"
            fixed
          >
            <template slot-scope="scope">
              <component
                :is="actionConfig.component"
                :row="scope.row"
                :handlers="actionConfig.handlers"
                @commonHanlerBridge="commonHanlerBridge"
                @doactive="doactive"
              />
              <!--  @commonHanlerBridge="commonHanlerBridge" 组件的事件广播-->
              <!--  row 是当前行/ handlers 是初始配置的方法传的  -->
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 注册的筛选器 -->
      <div v-clickoutside="allfilterHide">
        <template v-for="(item, key) in regfilters">
          <!-- 输入框选择器 -->
          <div
            v-show="filterAction[key]"
            :key="key"
            :class="{'filterWrap': true, 'hideBg': item.hideBg}"
            :style="item.position"
          >
            <div class="filterContainer">
              <component
                :is="item.component"
                :key="key"
                :data="item.dataItems"
                :filter-key="item.filterKey"
                :list-info="item.listInfo"
                :ref-name="item.refName"
                :c-data="item.cData"
                :c-props="item.cProps"
                :placeholder-str="item.myPlaceholder"
                :unit="item.unit"
                :ftn="item.ftn"
                :user-set-data="item.userSetData"
                @getFilterBridge="getFilterBridge"
              />
              <!-- :userSetData="item.userSetData" 用户自定义字段 好像没有使用-->
            </div>
          </div>
        </template>
      </div>
    </div>

    <!--  分页器区域-->
    <div v-if="pagination" class="paginationWrap">
      <el-pagination
        background
        :pager-count="7"
        layout="prev, pager, next"
        :page-count="pageConfig.pagenum"
        :current-page.sync="pageConfig.curpage"
        @current-change="clickpage"
      />
    </div>
  </div>
</template>
<script>
import editFilter from './filters/edit.vue'
import dateFilter from './filters/date.vue'
import cascaderFilter from './filters/cascader.vue'
import searchFilter from './filters/search.vue'
import radiosFilter from './filters/radio.vue'
import rangeFilter from './filters/range.vue'
import textFilter from './filters/inputText.vue'

import Bus from './js/Bus.js'
import { getFilter, doDeleteFilter, initFilterData } from './js/index.js'
// 筛选器组件
var myFilterComponts = {
  edit: editFilter, // 输入框选择器
  date: dateFilter, // 日期选择器
  cascader: cascaderFilter, // 级联搜索
  search: searchFilter, // 自动搜索
  radio: radiosFilter,
  range: rangeFilter, // 输入框区间
  text: textFilter
}
// 默认筛选器字段
const ComFilterDefConfig = {
  cData: [],
  userSetData: [],
  dataItems: [],
  cProps: {},
  filterKey: '',
  listInfo: {},
  myPlaceholder: '',
  unit: '',
  ftn: '',
  hideBg: false
}
// 渲染后各类型筛选器的数量 对应的filter的key 有多个一样类型的筛选器
var curFilterCount = {
  edit: 0,
  date: 0,
  cascader: 0,
  search: 0,
  radio: 0,
  range: 0
}
var _regFilter = {} // 所有的对象
var _filterAction = {} // 动作状态对象 radio_gender: true
// 存放当前显示的 filter数据 e--》filter的header  filter--》filter的对象映射
var _curFilter = '' // 当前元素
var _filterbar = null // 点击元素的父元素
var _regfilterarr = []
export default {
  name: 'DgTable',
  directives: {
    // 移除选择器触发指令
    clickoutside: {
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
  },
  props: {
    columnConfig: {// 栏数据
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
        return { pagenum: 1, curpage: 1 }
      }
    },
    filterInit: {
      type: Array,
      default: function() {
        return []
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
    // 操作栏 对象
    actionConfig: {
      type: Object,
      default: {}
    },
    // element自带的字段 显示加载
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bardata: [], // 选择的筛选项组合
      regfilters: {}, // 所有的组件对象 非常的重要
      filterAction: {}// 动态显示  radio_gender: true
    }
  },
  destroyed() {
    // 销毁
    initFilterData()
    for (const k in curFilterCount) {
      curFilterCount[k] = 0
    }
    _regFilter = {}
    _filterAction = {}// 状态对象
    _curFilter = '' // 当前
    _filterbar = null// 父级别
  },
  mounted: function() {
    // this.initFilterBar()
    this.columnConfig.forEach(item => {
      if (item.filterConfig) {
        this.doRegFilters(item.filterConfig.type, item)
      }
    })
    window.onresize = () => {
      setTimeout(() => {
        if (_filterbar) this.filterPosition(_filterbar, _curFilter)
      }, 0)
    }
  },
  methods: {
    // 点击分页
    clickpage(val) {
      this.$emit('page-change', val)
    },
    // 删除tag,筛选条件的增删,点击删除了自己
    handleClose(tag) {
      this.bardata.splice(this.bardata.indexOf(tag), 1)
      var dofilter = doDeleteFilter(tag)
      // 删除再次搜索
      this.$emit('filter-change', dofilter)
    },
    getTime(UTCDateString, type = 'Y-M-D') {
      if (!UTCDateString) {
        return '-'
      }

      function formatFunc(str) {
        return str > 9 ? str : '0' + str
      }

      var date2 = new Date(UTCDateString)
      var year = date2.getFullYear()
      var mon = formatFunc(date2.getMonth() + 1)
      var day = formatFunc(date2.getDate())
      var hour = date2.getHours()
      hour = formatFunc(hour)
      var min = formatFunc(date2.getMinutes())
      var dateStr
      if (type === 'Y-M-D') {
        dateStr = year + '.' + mon + '.' + day
      } else {
        dateStr = year + '.' + mon + '.' + day + '   ' + hour + ':' + min
      }
      return dateStr
    },
    getText(val) {
      var attarr = val.cc.prop.split('.')
      var curobj = val.s
      for (var i = 0; i < attarr.length; i++) {
        if (!curobj[attarr[i]] && curobj[attarr[i]] !== 0) {
          return '-'
        }
        curobj = curobj[attarr[i]]
      }
      if (val.cc.cb) {
        return val.cc.cb(curobj)
      }
      return curobj
    },
    doactive(d) {
      this.$emit(d.func, d.args)
    },
    // 筛选器组件广播事件
    getFilterBridge(val) {
      console.log(val, 'val')
      const formatdata = getFilter(val)
      // 操作删选项
      this.bardata = formatdata.showfilter
      this.$emit('filter-change', formatdata.dofilter)
      // 把状态调整
      this.allfilterHide('none')
    },
    // 函数通讯桥梁
    // func---》页面要执行的函数名字
    // data---》需要的数据
    commonHanlerBridge({ func, data }) {
      this.$emit(func, data)
    },
    // 注册筛选器
    // 根据已经注册的该类型的筛选器的个数来确定
    // 筛选器的标志
    // 成功注册后该类型的筛选器 +1
    doRegFilters(ftype, columconfig) {
      // 注册自定义筛选器
      if (!myFilterComponts[ftype]) {
        this.regCustomizeFilter(ftype, columconfig.filterConfig)
      }
      var filtertag = `${ftype}_${columconfig.prop}`
      if (_regfilterarr.indexOf(filtertag) !== -1) return // 有就返回
      curFilterCount[ftype] += 1
      const _filterConfig = columconfig.filterConfig // 拿到过滤器的配置,表格栏目的配置项
      if (!_filterConfig) return
      _regfilterarr.push(filtertag)
      // _regfilterarr, filtertag 标签和数组
      // 解决vue在 以索引的情况赋值 页面不刷新的问题
      const config = {
        show: false,
        refName: filtertag,
        component: myFilterComponts[ftype],
        position: { top: 0, left: 0 }
      }
      const filterConfig = Object.assign(config, ComFilterDefConfig, columconfig.filterConfig)
      this.$set(_regFilter, filtertag, filterConfig)// 循环添加了{}
      this.regfilters = _regFilter // 所有的头包含的组件
      this.filterAction = JSON.parse(JSON.stringify(_filterAction)) // 空对象
      return filtertag
    },
    // 传的组件类型 库里面没有
    regCustomizeFilter(ftype, fconfig) {
      if (curFilterCount.hasOwnProperty(ftype)) {
        // 给库里设个默认值
        curFilterCount[ftype] = 0
      }
      const customizeFilter = {}
      customizeFilter[ftype] = fconfig.component
      // 给库添加一个配置项
      myFilterComponts = Object.assign({}, myFilterComponts, customizeFilter)
    },
    headerClick(e) {
      e.cancelBubble = true
      const curElId = e.currentTarget.id // 点击元素
      const curParentElId = e.currentTarget.parentElement.parentElement // 点击元素的父父元素
      // 清空状态
      if (_filterAction[curElId]) {
        document.querySelector(`#${curElId} i`) &&
        document.querySelector(`#${curElId} i`).setAttribute('class', 'el-icon-caret-bottom')
      } else {
        document.querySelector(`#${curElId} i`) &&
        document.querySelector(`#${curElId} i`).setAttribute('class', 'el-icon-caret-top')
      }
      this.allfilterHide(curElId)
      this.filterPosition(curParentElId, curElId)
      this.$set(_filterAction, curElId, !_filterAction[curElId])
      this.filterAction = _filterAction// 动作对象
      console.log(this.filterAction, 'filterAction')
      var type = curElId.split('_')[0]
      _curFilter = curElId
      _filterbar = curParentElId
      if (type === 'date' && _filterAction[_curFilter]) {
        Bus.$emit('OPEN_DGTABLE_DATE_FILTER', curElId)
      }
      if (type === 'cascader' && _filterAction[_curFilter]) {
        Bus.$emit('OPEN_DGTABLE_CASCADER_FILTER', curElId)
      }
      if (type === 'radio' && _filterAction[_curFilter]) {
        Bus.$emit('LOAD_DGTABLE_RADIO_DATA', curElId)
      }
    },
    filterPosition(filterbar, filtertag) {
      var offsetLeft = filterbar.offsetLeft
      var offsetHeight = filterbar.offsetHeight
      // 调整筛选组件的位置
      if (_regFilter[filtertag]) {
        this.$set(_regFilter[filtertag].position, 'top', offsetHeight - 10 + 'px')
        this.$set(_regFilter[filtertag].position, 'left', offsetLeft + 'px')
      }
      this.regfilters = _regFilter
    },
    allfilterHide(cfilter) {
      // 调整上下箭头
      for (var k in _filterAction) {
        if (k !== cfilter) {
          this.$set(_filterAction, k, false) // 改下箭头的状态,set方法会刷新页面
          if (document.querySelector(`#${k} i`)) {
            document.querySelector(`#${k} i`).setAttribute('class', 'el-icon-caret-bottom')
          }
        }
      }
      this.filterAction = _filterAction
    },
    // 单选或者多选事件
    handleSelectChange(val) {
      // 解决选择 页面重新渲染的问题
      // _regFilter = {}
      // _filterAction = {}
      // this.regfilters = _regFilter
      this.$emit('select-change', val)
    },
    // 用于初始化 filters bar
    initFilterBar() {
      // 并不存在啊
      const initfilters = this.tableInfo.toolsConfig.filters
      if (typeof initfilters === 'object' && typeof initfilters.length !== 'number') {
        const tags = []
        initFilterData(initfilters)
        for (const k in initfilters) {
          tags.push(initfilters[k])
        }
        // 删选项
        this.bardata = tags
      }
    }
  }
}
</script>

<style scoped>
  @import './css/common.css';

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
