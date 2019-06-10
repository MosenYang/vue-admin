<template>
  <div>
    <div class="filterbox">
      <!--筛选项内容区-->
      <div v-if="bardata" class="filter-with-count">
        <el-tag v-for="(item, index) in bardata"
                :key="index"
                disable-transitions
                closable
                style="margin-right:10px;"
                size="small"
                type="info"
                @close="handleClose($event,item)">
          <span v-if="item.ftn" style="color:#bbb">{{ item.ftn }}:</span>{{ item.label }}
        </el-tag>
      </div>
    </div>
    <div v-if="tableData" style="position:relative">
      <el-table ref="eltable"
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
              <!-- 表格头部-->
              <span :id="`${item.filterConfig.type}_${item.prop}`"
                    class="customize_filter"
                    style="cursor:pointer;display:inline-block"
                    @click="headerClick($event,item)">
                  <span style="padding-right:3px;">{{ item.label }}</span>
                <!--上下箭头-->
                  <i class="el-icon-caret-bottom" v-if="item.filterConfig && item.isNeed"></i>
                </span>
            </template>
            <!-- -->
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
          <el-table-column v-if="actionConfig.type === 'textbtn'"
                           :width="actionConfig.width"
                           label="操作">
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
            fixed>
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
      <div v-clickOutSide="allFilterHide">
        <template v-for="(item, key) in regFilters">
          <div v-show="filterAction[key]" :key="key" :class="{'filterWrap': true}" :style="item.position">
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
        :page-count="pageConfig.pageNum"
        :current-page.sync="pageConfig.curPage"
        @current-change="clickpage"
      />
    </div>
  </div>
</template>
<script>
import editFilter from './defFilter/edit.vue'
import searchFilter from './defFilter/search.vue'
// import Bus from './js/Bus.js'
import { getFilter, doDeleteFilter, initFilterData } from './index.js'
// 默认筛选器组件
var defComponents = {
  edit: editFilter, // 输入框选择器
  search: searchFilter // 自动搜索
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
var _filterAction = {} // 动作状态对象 radio_gender: true
var _curFilter = '' // 当前元素
var _filterbar = null // 点击元素的父元素
export default {
  name: 'DgTable',
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
        return {
          pageNum: 1, curPage: 1
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
      bardata: [
        {
          ftn: '名字',
          label: '王宇'
        }
      ],
      regFilters: {}, // 所有的组件对象 非常的重要
      filterAction: {}// 动态显示  radio_gender: true
    }
  },
  watch: {
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
      }, 100)
    }
  },
  destroyed() {
    // initFilterData()
    _filterAction = {}// 状态对象
    _curFilter = '' // 当前
    _filterbar = null// 父级
  },
  methods: {
    clickpage(val) {
      this.$emit('page-change', val)
    },
    handleClose(tag) {
      this.bardata.splice(this.bardata.indexOf(tag), 1)
      var dofilter = doDeleteFilter(tag)
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
      this.bardata = formatdata.showfilter
      this.$emit('filter-change', formatdata.dofilter)
      this.allFilterHide('none')
    },
    // 函数通讯桥梁
    commonHanlerBridge({ func, data }) {
      this.$emit(func, data)
    },
    doRegFilters(ftype, columconfig) {
      let filterTag = `${ftype}_${columconfig.prop}`
      if (!defComponents[ftype]) {
        this.mixinFilter(ftype, columconfig.filterConfig)
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

      this.$set(this.regFilters, filterTag, filterConfig)
      console.log(this.regFilters, '所有的头包含的组件,会渲染出来')
      this.filterAction = JSON.parse(JSON.stringify(_filterAction)) // 空对象
      return filterTag
    },
    mixinFilter(ftype, config) {
      if (config.component) {
        let newFilter = { [ftype]: config.component }
        defComponents = Object.assign({}, defComponents, newFilter)
      }
    },
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
      console.log(this.filterAction, 'filterAction动作对象')
      var type = curElId.split('_')[0]
      _curFilter = curElId
      _filterbar = curParentElId
      // if (type === 'date' && _filterAction[_curFilter]) {
      //   Bus.$emit('OPEN_DGTABLE_DATE_FILTER', curElId)
      // }
      // if (type === 'cascader' && _filterAction[_curFilter]) {
      //   Bus.$emit('OPEN_DGTABLE_CASCADER_FILTER', curElId)
      // }
      // if (type === 'radio' && _filterAction[_curFilter]) {
      //   Bus.$emit('LOAD_DGTABLE_RADIO_DATA', curElId)
      // }
    },
    filterPosition(filterbar, filtertag) {
      var offsetLeft = filterbar.offsetLeft
      var offsetHeight = filterbar.offsetHeight
      if (this.regFilters[filtertag]) {
        this.$set(this.regFilters[filtertag].position, 'top', offsetHeight - 10 + 'px')
        this.$set(this.regFilters[filtertag].position, 'left', offsetLeft- 20 + 'px')
      }
    },
    allFilterHide(cfilter) {
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
  //完毕
}
</script>

<style scoped>
  /*@import './css/common.css';*/

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
